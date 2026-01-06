import { Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { CustomRequest } from "../../types/req.type";
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
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
    const profileImage = req.file;
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

    const profile = await createProfile(profileData);
    if (profileImage) {
      await queue.add(
        "image",
        profileQueueOptions(profileImage),
        imageQueueOptions
      );
      const imagery = profileImage.originalname.split(".")[0] + ".webp";
      const updatedProfile = await updateProfile({
        id: profile.id,
        userId: userId,
        avatarUrl: imagery,
      });
      res.status(200).json({
        message: "Profile successfully created",
        data: updateProfile,
      });
    }
  },
];

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
    const profileImage = req.file;
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
        gender,
      };
      profile = await updateProfile(toUpdateData);

      if (profileImage) {
        if (isProfile?.avatarUrl) {
          const oldProfileImagePath = path.join(
            __dirname,
            "../../../",
            "uploads/optimized",
            isProfile?.avatarUrl!
          );
          unlink(oldProfileImagePath, (error) => {
            console.log(error);
          });
        }
        await queue.add(
          "image",
          profileQueueOptions(profileImage),
          imageQueueOptions
        );
        const imageUrl = profileImage.originalname.split(".")[0] + ".webp";
        profile = await updateProfile({
          id: profileId,
          userId,
          avatarUrl: imageUrl,
        });
      }
    }

    res.status(200).json({
      message: "You successfully updated.",
      data: profile,
    });
  },
];

export const updateProfileCoverImageController = [
  param("profileId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const userId = req.userId as string;
    const coverImage = req.file;
    const profileId = req.params.profileId as string;

    const isProfile = await findProfileById(profileId);
    checkProfileIfNotExit(isProfile);

    let profile;
    if (isProfile?.userId !== userId) {
      return next({
        message: "You cannot updated this profile",
        status: 403,
        code: errorCode.unauthenticated,
      });
    } else {
      if (coverImage) {
        if (isProfile.coverUrl) {
          const oldProfileImagePath = path.join(
            __dirname,
            "../../../",
            "uploads/optimized",
            isProfile.coverUrl!
          );
          unlink(oldProfileImagePath, (error) => {
            console.log(error);
          });
        }
        await queue.add(
          "image",
          profileQueueOptions(coverImage),
          imageQueueOptions
        );
        const imageUrl = coverImage.originalname.split(".")[0] + ".webp";
        profile = await updateProfile({
          id: isProfile.id,
          userId,
          coverUrl: imageUrl,
        });
      }
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
