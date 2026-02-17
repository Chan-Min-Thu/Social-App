import { FriendType } from "./../../types/friend.type";
import {
  acceptedFriend,
  blockYourAccount,
  deleteBlockUser,
  deleteFriendship,
  findFriendsByUserId,
  findFriendshipWithThisId,
  getAcceptedAndPendingFriends,
  getFriendRequest,
  getFriends,
  getFriendsAcceptedAndPending,
  getOtherUser,
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
import {
  findProfileByUserId,
  findUserById,
} from "../../services/profileService";
import { UserType } from "../../types/user.type";
import { errorFun } from "../../utils/utilFunction/errorFun";
import { findPostsByUserId } from "../../services/postService";

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
  param("friendId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;

    const { userId } = req; // Your ID
    const { friendId } = req.params; // The ID of the profile you are visiting

    // 1. Block Check
    const isBlock = await blockYourAccount({ userId: userId!, friendId });
    if (isBlock) {
      return next({ message: "You can't see this profile", status: 403 });
    }

    // 2. Self-View Check
    if (userId === friendId) {
      return res
        .status(302)
        .json({ message: "Redirecting to your own profile" });
    }

    // 3. Parallel Fetch
    const [userProfile, posts, friends, baseUser] = await Promise.all([
      findProfileByUserId(friendId),
      findPostsByUserId(friendId),
      findFriendsByUserId(friendId),
      findFriendshipWithThisId(String(userId)),
    ]);

    const targetFriendProfile = baseUser
      .map((user) =>
        user.addressee.id === userId ? user.requester : user.addressee,
      )
      .find((fri) => fri.id === friendId);

    if (!baseUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Correct Friend Mapping (Relative to the profile owner)
    const preparedFriends = friends.map((friend) => {
      const friendUser =
        friend.requesterId === friendId ? friend.addressee : friend.requester;
      return friendUser;
    });
    // 5. Unified Data Construction
    const profileData = {
      id: userProfile?.id || null,
      profile: {
        userId: friendId, // Use friendId here!
        username: userProfile?.user?.username || targetFriendProfile?.username,
        avatarUrl:
          userProfile?.user?.avatarUrl || targetFriendProfile?.avatarUrl,
        website: userProfile?.website || null,
        coverUrl: userProfile?.coverUrl || null,
      },
      info: userProfile
        ? {
            bio: userProfile.bio || null,
            location: userProfile.location || null,
            birthDate: userProfile.birthDate || null,
            gender: userProfile.gender || null,
          }
        : null,
      friends: preparedFriends,
      posts: posts || [],
    };
    // console.log("profileData", profileData);
    res.status(200).json({
      message: "Profile retrieved successfully",
      data: profileData,
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
      //1. Get current friends and pending fri to avoid  suggessting them
      const exitingRelations = await getAcceptedAndPendingFriends(userId);
      console.log("exitingRelations ,", exitingRelations)
      const excluedIds = new Set([
        userId,
        ...exitingRelations.map((f) =>
          f.addresseeId === userId ? f.requesterId : f.addresseeId,
        ),
      ]);

      const friends = await getFriends(userId);

      if (!friends.length) {
        //To get generla user if no friends yet
        friendsProfiles = await getOtherUser(userId, Array.from(excluedIds));
      } else {
        //3. Get Ids of current friends
        const friendsIds = friends.map((f) =>
          f.addresseeId === userId ? f.requesterId : f.addresseeId,
        );

        //4. Get all friends of Friends in parallel

        const friendsOfFriendsNested = await Promise.all(
          friendsIds.map((id) => getFriends(id)),
        );

        const suggestionMap = new Map();

        friendsOfFriendsNested.flat().forEach((record) => {
          //Determine who is friends of friend
          const potentialFriend = friendsIds.includes(record.requesterId)
            ? record.addressee
            : record.requester;

          if (!excluedIds.has(potentialFriend.id)) {
            suggestionMap.set(potentialFriend.id, potentialFriend);
          }
        });
        if (!Array.from(suggestionMap.values()).length) {
          friendsProfiles = await getOtherUser(userId, Array.from(excluedIds));
        } else {
          friendsProfiles = Array.from(suggestionMap.values());
        }
      }
    }
    console.log("friendsProfiles", friendsProfiles);
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
