import { FriendType } from "./../../types/friend.type";
import {
  acceptedFriend,
  blockYourAccount,
  deleteBlockUser,
  deleteFriendship,
  getFriendRequest,
  getFriends,
  getFriendsAcceptedAndPending,
  getSentFriends,
  profileWithFriend,
} from "./../../services/friendService";
import { NextFunction, Response } from "express";
import { body, param } from "express-validator";
import { CustomRequest } from "../../types/req.type";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import {
  requestedFriend,
  updatedFriend,
  findFriendship,
  createBlockUser,
  findBlockRow,
  getRequestedFriends,
  alreadyAcceptedFriend,
  alreadyRequestToBeFriend,
} from "../../services/friendService";
import { checkUserIfNotExit } from "../../utils/auth";
import {
  checkIsFriend,
  checkAlreadyFriend,
  checkBlockRow,
  checkAlreadyRequest,
} from "../../utils/check";
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
import { findProfileByUserId } from "../../services/profileService";
import { UserType } from "../../types/user.type";
import { errorFun } from "../../utils/utilFunction/errorFun";

export const requestFriendController = [
  body("addresseeId").isUUID().withMessage("AddresseeId was wrong."),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;

    const userId = req.userId as string;
    const addresseeId = req.body.addresseeId as string;
    if (addresseeId === userId) {
      const error: any = new Error("You can't send as a friend to yourself.");
      error.status = 400;
      error.code = errorCode.notMatched;
      return next(errorFun(error));
    }
    const isUser = (await getUserById(addresseeId)) as UserType;
    checkUserIfNotExit(isUser);
    const isFriend = await findFriendship({
      userId: userId,
      friendId: addresseeId,
    });

    checkAlreadyFriend(isFriend);
    const friendRequested = await requestedFriend({
      addresseeId,
      requesterId: userId,
    });
    res.status(200).json({
      message: "Requested Friend.",
      data: friendRequested,
    });
  },
];

export const toAcceptFriendController = [
  body("requesterId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const { requesterId } = req.body;
    const isAcceptedFriend = await alreadyAcceptedFriend({
      userId,
      toBeFriendId: requesterId,
    });
    checkAlreadyFriend(isAcceptedFriend);

    const isRequested = (await alreadyRequestToBeFriend({
      userId,
      toBeFriendId: requesterId,
    })) as FriendType;
    checkAlreadyRequest(isRequested);
    const id = isRequested.id as string;
    const updatedFriend = await acceptedFriend(id);
    res.status(200).json({
      message: "Accepted Friend.",
      data: updatedFriend,
    });
  },
];

export const blockFriendController = [
  body("blockedId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const { blockedId } = req.body;
    const isFriend = (await findFriendship({
      userId: userId,
      friendId: blockedId,
    })) as FriendType;
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
    const isFriend = (await findFriendship({
      userId: String(userId),
      friendId: blockedId,
    })) as FriendType;
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
        id: "" + isFriend.id,
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
    const status = req.params.status as string;
    const userId = req.userId as string;

    let friendsProfiles;
    if (status === "accepted") {
      let friends = await getFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, requester, addressee } = friend;
          const isProfile = addresseeId === userId ? requester : addressee;
          return { id, profile: isProfile };
        }),
      );
    } else if (status === "requested") {
      let friends = await getRequestedFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, requester } = friend;
          return { id, profile: requester };
        }),
      );
    } else if (status === "sent") {
      let friends = await getSentFriends(userId);
      friendsProfiles = await Promise.all(
        friends.map(async (friend) => {
          const { id, addresseeId, requesterId, addressee } = friend;
          return { id, profile: addressee };
        }),
      );
    } else if (status === "toadd") {
      let friends = await getFriends(userId);
      let friendIds = await Promise.all(
        friends.map(async (friend) => {
          const { addresseeId, requester, addressee } = friend;
          const isProfile = addresseeId === userId ? requester : addressee;
          return isProfile.id;
        }),
      );
      let friendOfFriendsPromises = await Promise.all(
        friendIds.map(async (friendId: string) => {
          const friend = await getFriends(friendId);
          return friend;
        }),
      );
      const friendOfFriends = await Promise.all(
        friendOfFriendsPromises?.[0]?.map((friend: FriendType) => {
          const { id, requesterId, requester, addresseeId, addressee } = friend;
          const profile = friendIds.includes(requesterId)
            ? addressee
            : requester;
          return { id, profile };
        }),
      );
      let acceptedAndPendingFriends =
        await getFriendsAcceptedAndPending(userId);
      let acceptedAndPendingFriendsIds = await Promise.all(
        acceptedAndPendingFriends.map((friend: FriendType) => {
          const { id, requesterId, requester, addresseeId, addressee } = friend;
          const isProfile = addresseeId === userId ? requester : addressee;
          return isProfile.id;
        }),
      );
      const suggestedFriends = friendOfFriends?.filter((friend) =>
        !acceptedAndPendingFriendsIds.includes(friend.profile.id) &&
        friend.profile.id !== userId
          ? friend
          : undefined,
      );
      console.log(suggestedFriends);
      friendsProfiles = suggestedFriends;
    }
    res.status(200).json({
      message: `They are ${status} friends.`,
      data: friendsProfiles,
    });
  },
];

export const removeFriendshipController = [
  body("removeFriendshipId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req.body, next)) return;

    const userId = req.userId as string;
    const removeFriendshipId = req.body.removeFriendshipId as string;

    const isRelated = (await findFriendship({
      userId,
      friendId: removeFriendshipId,
    })) as FriendType;
    checkIsFriend(isRelated);

    isRelated && (await deleteFriendship(isRelated.id!));

    res.status(201).json({
      message: "Your friendship already removed.",
    });
  },
];
