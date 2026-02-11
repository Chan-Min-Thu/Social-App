import { verifyOtp } from "./../controllers/authController";

export type CreateOtpType = {
  otp: string;
  email: string;
  rememberToken: string;
};

export type ComfirmOtpType = {
  verifyToken: string;
  error: number;
  count: number;
};
