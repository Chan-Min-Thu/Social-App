import express from "express";
import {
  register,
  verifyOtp,
  confirmPassword,
  login,
  logout,
  authCheck,
  updatePassword,
} from "@/controllers/authController";
import { auth } from "@/middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/confirm-password", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);
router.get("/auth-check", auth, authCheck);
router.post("/update-password", auth, updatePassword);
export default router;
