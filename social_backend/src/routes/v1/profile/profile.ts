import express from "express";
import { uploadMemory } from "@/middlewares/uploadFile";
import {
  createProfileController,
  createProfileNameController,
  getProfileForMeController,
  updateProfileController,
  uploadCoverImageController,
  uploadProfileImageController,
} from "@/controllers/profile/profileController";

const router = express.Router();

router.post("/profile", createProfileController);
router.post("/profile/user-profile",uploadMemory.single("profileImage"),createProfileNameController);
router.post(
  "/profile/profile-image",
  uploadMemory.single("profileImage"),
  uploadProfileImageController,
);
router.post(
  "/profile/cover-image",
  uploadMemory.single("coverImage"),
  uploadCoverImageController,
);

router.patch("/profile/:profileId", updateProfileController);

router.get("/profile/me", getProfileForMeController);

export default router;
