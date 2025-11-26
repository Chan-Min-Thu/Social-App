import {
  blockYourAccount,
  deleteBlockUser,
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
export const requestFriendController = [
  body("addresseeId").isUUID().withMessage("AddresseeId was wrong."),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    req.body;
    if (reqBodyErrorFn(req, next)) return;

    const userId = req.userId as string;
    const addresseeId = req.body.addresseeId as string;

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
      data: { friend: friendship },
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
      data: { profile: user },
    });
  },
];
