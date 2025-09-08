import { Response, NextFunction } from "express";
import { body } from "express-validator";
import { CustomRequest } from "../../types/req.type";
import { reqbodyErrorFn } from "../../utils/utilfunction/reqbodyError";
import {
  findProfileByUserId,
  findProfileById,
} from "../../services/profileService";
import {
  checkAlreadyProfile,
  checkCommentIfNotExit,
  checkProfileIfNotExit,
} from "../../utils/check";
import { imageQueueOptions, profileQueueOptions } from "../../config/queueData";
import { createProfile, updateProfile } from "../../services/profileService";
import queue from "../../job/queues/queue";
import path from "path";
import { errorCode } from "../../config/errorCode";
import { unlink } from "fs";

//   bio       String?   @db.Text
//   avatarUrl String?
//   coverUrl  String?
//   location  String?
//   website   String?
//   birthDate DateTime?
//   gender    Gender?

export const createProfileController = [
  body("bio").trim().isLength({ max: 200 }).notEmpty().escape(),
  body("location").trim().notEmpty().escape(),
  body("website").trim().isURL().optional({ nullable: true, checkFalsy: true }),
  body("birthDate").toDate().optional({ nullable: true, checkFalsy: true }),
  body("gender").notEmpty().escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = req.userId;
    const profileImage = req.file;
    console.log(profileImage);
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
      gender,
      userId,
    };

    let profile = await createProfile(profileData);
    if (profileImage) {
      await queue.add(
        "optimized-profile-image",
        profileQueueOptions(profileImage),
        imageQueueOptions
      );
      const imageurl = profileImage.originalname.split(".")[0] + ".webp";
      profile = await updateProfile({ id: profile.id, avatarUrl: imageurl });
    }

    res.status(200).json({
      message: "Profile successfully created",
      data: {
        profile,
      },
    });
  },
];

export const updateProfileController = [
  body("profileId").notEmpty(),
  body("bio").trim().isLength({ max: 200 }).notEmpty().escape(),
  body("location").trim().notEmpty().escape(),
  body("website").trim().isURL().optional({ nullable: true, checkFalsy: true }),
  body("birthDate").toDate().optional({ nullable: true, checkFalsy: true }),
  body("gender").notEmpty().escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = req.userId;
    const profileImage = req.file;
    const { profileId, bio, location, website, birthDate, gender } = req.body;

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
      console.log("Update Profile");
      const toUpdateData = {
        id: profileId,
        bio,
        location,
        website,
        birthDate,
        gender,
      };
      profile = await updateProfile(toUpdateData);

      if (profileImage) {
        const oldProfileImagePath = path.join(
          __dirname,
          "../../../",
          "uploads/optimized",
          isProfile?.avatarUrl!
        );
        unlink(oldProfileImagePath, (error) => {
          console.log(error);
        });
        await queue.add(
          "optimized-profile-image",
          profileQueueOptions(profileImage),
          imageQueueOptions
        );
        const imageurl = profileImage.originalname.split(".")[0] + ".webp";
        profile = await updateProfile({
          id: profileId,
          avatarUrl: imageurl,
        });
      }
    }

    res.status(200).json({
      message: "You successfully updated.",
      data: { profile },
    });
  },
];

export const updateProfileCoverImageController = [
  body("profileId").notEmpty().isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = req.userId;
    const coverImage = req.file;
    const { profileId } = req.body;

    const isProfile = await findProfileById(profileId);
    checkProfileIfNotExit(isProfile);

    console.log(userId, isProfile?.userId);
    let profile;
    if (isProfile?.userId !== userId) {
      return next({
        message: "You cannot updated this profile",
        status: 403,
        code: errorCode.unauthenticated,
      });
    } else {
      if (coverImage) {
        if (isProfile?.coverUrl) {
          const oldProfileImagePath = path.join(
            __dirname,
            "../../../",
            "uploads/optimized",
            isProfile?.coverUrl!
          );
          unlink(oldProfileImagePath, (error) => {
            console.log(error);
          });
        }
        await queue.add(
          "optimized-profile-image",
          profileQueueOptions(coverImage),
          imageQueueOptions
        );
        const imageurl = coverImage.originalname.split(".")[0] + ".webp";
        profile = await updateProfile({
          id: profileId,
          coverUrl: imageurl,
        });
      }
    }

    res.status(200).json({
      message: "You successfully updated.",
      data: { profile },
    });
  },
];

export const getProfileForMeController = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  const user = await findProfileByUserId(userId!);
  checkProfileIfNotExit(user);

  res.status(200).json({
    message: "This is your searched profile",
    data: user,
  });
};
