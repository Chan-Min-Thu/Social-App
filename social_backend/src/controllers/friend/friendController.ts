import {
  blockYourAccount,
  deleteBlockUser,
  getFriends,
  getSentFriends,
} from "./../../services/friendService";
import { NextFunction, Response } from "express";
import { body, param } from "express-validator";
import { CustomRequest } from "../../types/req.type";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import {
  getFriendRequest,
  requestedFriend,
  updatedFriend,
  findFriendship,
  createBlockUser,
  findBlockRow,
  getRequestedFriends,
} from "../../services/friendService";
import { checkUserIfNotExit } from "../../utils/auth";
import {
  checkAcceptFriendListExit,
  checkIsFriend,
  checkAlreadyFriend,
  checkBlockRow,
} from "../../utils/check";
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
import { findProfileByUserId } from "../../services/profileService";
import { UserType } from "../../types/user.type";
import { Friend } from "../../../generated/prisma/client";
import { errorFun } from "../../utils/utilFunction/errorFun";

export const requestFriendController = [
  body("addresseeId").isUUID().withMessage("AddresseeId was wrong."),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;

    const userId = req.userId as string;
    const addresseeId = req.body.addresseeId as string;
    if (addresseeId === userId) {
      const error: any = new Error("You can't send as a friend yourseld");
      error.status = 400;
      error.code = errorCode.notMatched;
      return next(errorFun(error));
    }
    const isUser = (await getUserById(addresseeId)) as UserType;
    checkUserIfNotExit(isUser);
    const isFriend = await findFriendship({
      userId: userId,
      blockedId: addresseeId,
    });
    checkAlreadyFriend(isFriend);
    const friendRequested = await requestedFriend({
      addresseeId,
      requesterId: userId,
    });
    res.status(200).json({
      message: "Requested Friend.",
      data: { friend: friendRequested },
    });
  },
];

export const acceptFriendController = [
  body("requesterId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId;
    const { requesterId } = req.body;
    const isAcceptFriend = await getFriendRequest(String(userId));
    checkAcceptFriendListExit(isAcceptFriend);
    let acceptFriend;
    if (isAcceptFriend.length > 0) {
      const isRequested = isAcceptFriend.find(
        (friend: Friend) => friend.requesterId === requesterId
      );
      if (!isRequested) {
        return next({
          message: "This user doesn't request to you.",
          status: 400,
          code: errorCode.notMatched,
        });
      }
      acceptFriend = await updatedFriend({
        id: isRequested.id,
        status: "accepted",
      });
    }
    res.status(200).json({
      message: "Accepted Friend.",
      data: { friend: acceptFriend },
    });
  },
];

export const blockFriendController = [
  body("blockedId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const { blockedId } = req.body;
    const isFriend = await findFriendship({
      userId: String(userId),
      blockedId,
    });
    checkIsFriend(isFriend);

    let friendship;
    if (isFriend!.id) {
      await createBlockUser({ blockerId: userId, blockedId });

      friendship = await updatedFriend({ id: isFriend!.id, status: "blocked" });
    }
    res.status(200).json({
      message: "Accepted Friend.",
      data: { friend: friendship },
    });
  },
];

export const unblockFriendController = [
  body("blockedId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId;
    const { blockedId } = req.body;
    const isFriend = await findFriendship({
      userId: String(userId),
      blockedId,
    });
    checkIsFriend(isFriend);
    const isBlock = await findBlockRow({
      blockerId: String(userId),
      blockedId,
    });
    checkBlockRow(isBlock);

    let friendship;
    if (isBlock!.id) {
      await deleteBlockUser(isBlock!.id);

      friendship = await updatedFriend({
        id: isFriend!.id,
        status: "accepted",
      });
    }
    res.status(200).json({
      message: "Accepted Friend.",
      data: friendship,
    });
  },
];

export const getOtherProfileController = [
  param("profileId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId as string;

    const profileId = req.params.profileId as string;
    const isBlock = await blockYourAccount({ userId, profileId });
    let user;
    if (isBlock !== null) {
      return next({
        message: "You can't see this profile",
        status: 400,
        code: errorCode.forbidden,
      });
    } else {
      if (userId !== profileId) {
        user = await findProfileByUserId(profileId);
      } else {
        return next({
          message: "This is your profile. Please go to /profile/me",
          status: 400,
          code: errorCode.invalid,
        });
      }
    }
    res.status(200).json({
      message: "This is your searched profile",
      data: user,
    });
  },
];

const friendStatus = ["requested", "accepted", "blocked", "sent", "toadd"];

export const getFriendsContorller = [
  param("status").isString().notEmpty().isIn(friendStatus),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    console.log(req.params.status);
    const status = req.params.status as string;
    const userId = req.userId as string;

    let friendsProfiles;
    if (status === "accepted") {
      let friends = await getFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, requester, addressee } = friend;
          const isProfile = addresseeId === userId ? requester : addressee;
          return { id, addresseeId, requesterId, profile: isProfile };
        })
      );
    } else if (status === "requested") {
      let friends = await getRequestedFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, requester } = friend;
          return { id, addresseeId, requesterId, profile: requester };
        })
      );
    } else if (status === "sent") {
      let friends = await getSentFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, addressee } = friend;
          return { id, addresseeId, requesterId, profile: addressee };
        })
      );
    } else {
      return null;
    }

    res.status(200).json({
      message: `They are ${status} friends.`,
      data: friendsProfiles,
    });
  },
];
