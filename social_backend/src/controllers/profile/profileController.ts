import { Response, NextFunction } from "express";
import { unlink } from "fs";
import path from "path";
import { body, param } from "express-validator";

import queue from "../../job/queues/queue";
import {
  coverQueueOptions,
  imageQueueOptions,
  profileQueueOptions,
} from "../../config/queueData";
import { errorCode } from "../../config/errorCode";
import { CustomRequest } from "../../types/req.type";
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
import { checkAlreadyProfile, checkProfileIfNotExit } from "../../utils/check";
import {
  findProfileById,
  findProfileByUserId,
  findUserById,
  updateProfileImage,
  createProfile,
  updateProfile,
} from "../../services/profileService";
import { findPostsByUserId } from "../../services/postService";
import { findFriendsByUserId } from "../../services/friendService";
import { checkUserExit } from "../../utils/auth";
import { updateUser } from "../../services/authService";

export const createProfileController = [
  body("bio")
    .trim()
    .isLength({ max: 200 })
    .notEmpty()
    .escape()
    .optional()
    .withMessage("Bio does not match."),
  body("location")
    .trim()
    .notEmpty()
    .escape()
    .optional()
    .withMessage("Location does not match."),
  body("website").trim().isURL().optional({ nullable: true, checkFalsy: true }),
  body("birthDate").toDate().optional({ nullable: true, checkFalsy: true }),
  body("gender").notEmpty().escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const { bio, location, website, birthDate, gender } = req.body;

    // Check Profile already exit
    const isProfile = await findProfileByUserId(userId!);
    checkAlreadyProfile(isProfile);

    // Create Profile
    const profileData = {
      bio,
      location,
      website,
      birthDate,
      gender: gender.toUpperCase(),
      userId,
    };

    const profile = await createProfile(profileData);

    res.status(200).json({
      message: "Profile successfully created",
      data: profile,
    });
  },
];

export const createProfileNameController = [
  body("username")
    .trim()
    .notEmpty()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Username must fill, it's not optional."),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const username = req.body.username;
    const avatarImage = req.file;
    const foundUser = await findUserById(userId);
    if (foundUser?.username) {
      return next({
        message: "You cannot updated this profile",
        status: 403,
        code: errorCode.alreadyExit,
      });
    }
    let avatarUrl;
    if (avatarImage) {
      await queue.add(
        "image",
        coverQueueOptions(avatarImage),
        imageQueueOptions,
      );

      avatarUrl = avatarImage.originalname.split(".")[0] + ".webp";
    }

    const user = await updateUser(userId, { username, avatarUrl });

    return res.status(200).json({
      message: "Your username successfully added.",
      data: user,
    });
  },
];

export const uploadCoverImageController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = req.userId as string;
  const coverImage = req.file;

  const profileInfo = await findProfileByUserId(userId);
  checkProfileIfNotExit(profileInfo);

  let info;
  if (coverImage) {
    if (profileInfo?.coverUrl) {
      const oldCoverImagePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimized",
        profileInfo.coverUrl,
      );
      unlink(oldCoverImagePath, (error) => {
        console.log("Old Profile path is not correct", error);
      });

      await queue.add(
        "image",
        coverQueueOptions(coverImage),
        imageQueueOptions,
      );
    }

    const coverUrl = coverImage.originalname.split(".")[0] + ".webp";
    info = await updateProfile({ id: "" + profileInfo?.id, coverUrl });
  }
  res.status(200).json({
    message: "You successfully updated.",
    data: info,
  });
};

export const uploadProfileImageController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId as string;
  const profileImage = req.file;
  const user = await findUserById(userId);
  let profile;
  if (profileImage) {
    if (user?.avatarUrl) {
      const oldProfileImagePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimized",
        user?.avatarUrl!,
      );
      unlink(oldProfileImagePath, (error) => {
        console.log("oldProfileImagePath is not correct ", error);
      });
    }
    await queue.add(
      "image",
      profileQueueOptions(profileImage),
      imageQueueOptions,
    );
    const imageUrl = profileImage.originalname.split(".")[0] + ".webp";
    profile = await updateProfileImage({
      id: user!.id,
      avatarUrl: imageUrl,
    });
  }
  res.status(200).json({
    message: "Profile image successfully uploaded.",
    data: profile,
  });
};

export const updateProfileController = [
  param("profileId").isUUID(),
  body("bio").trim().isLength({ max: 200 }).notEmpty().escape(),
  body("location").trim().notEmpty().escape(),
  body("website").trim().isURL().optional({ nullable: true, checkFalsy: true }),
  body("birthDate").toDate().optional({ nullable: true, checkFalsy: true }),
  body("gender").notEmpty().escape().optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const profileId = req.params.profileId as string;
    const { bio, location, website, birthDate, gender } = req.body;

    const isProfile = await findProfileById(profileId);
    checkProfileIfNotExit(isProfile);

    let profile;
    if (isProfile?.userId !== userId) {
      next({
        message: "You cannot updated this profile",
        status: "403",
        code: errorCode.unauthenticated,
      });
    } else {
      const toUpdateData = {
        id: profileId,
        userId,
        bio,
        location,
        website,
        birthDate,
        gender: gender.toUpperCase(),
      };
      profile = await updateProfile(toUpdateData);
    }

    res.status(200).json({
      message: "You successfully updated.",
      data: profile,
    });
  },
];

export const getProfileForMeController = async (
  req: CustomRequest,
  res: Response,
) => {
  const userId = req.userId as string;

  const [userProfile, posts, friends, baseUser] = await Promise.all([
    findProfileByUserId(userId),
    findPostsByUserId(userId),
    findFriendsByUserId(userId),
    findUserById(userId),
  ]);

  const preparedFriends = friends.map((friend) => {
    const friendUser =
      friend.requesterId === userId ? friend.addressee : friend.requester;
    return friendUser;
  });

  let profileData;
  if (!userProfile) {
    profileData = {
      profile: {
        username: baseUser?.username,
        website: null,
        avatarUrl: baseUser?.avatarUrl,
        coverUrl: null,
      },
      info: null,
      friends: preparedFriends.length ? preparedFriends : [],
      posts: posts,
    };
  } else {
    const { id, bio, location, website, birthDate, coverUrl, gender } =
      userProfile;

    const { username, avatarUrl } = userProfile?.user;

    const profile = {
      userId,
      username,
      website,
      avatarUrl,
      coverUrl,
    };
    const info = {
      id: id,
      bio: bio ?? null,
      location: location ?? null,
      birthDate: birthDate ?? null,
      website: website ?? null,
      gender: gender ?? null,
    };

    profileData = {
      id,
      profile,
      info,
      friends: preparedFriends.length ? preparedFriends : [],
      posts,
    };
  }
  res.status(200).json({
    message: "This is your searched profile",
    data: profileData,
  });
};
