import express from "express";
import { uploadMemory } from "../../../middlewares/uploadFile";
import {
  createProfileController,
  getProfileForMeController,
  updateProfileController,
  updateProfileCoverImageController,
} from "../../../controllers/profile/profileController";
import { get } from "http";

const router = express.Router();

router.post(
  "/profile",
  uploadMemory.single("profilePicture"),
  createProfileController
);
router.patch(
  "/profile/:profileId",
  uploadMemory.single("profilePicture"),
  updateProfileController
);
router.patch(
  "/profile/cover_photo/:profileId",
  uploadMemory.single("coverPhoto"),
  updateProfileCoverImageController
);

router.get("/profile/me", getProfileForMeController);

export default router;
