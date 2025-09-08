import { randomBytes } from "crypto";

export const generateOtp = () => {
  return (parseInt(randomBytes(32).toString("hex"), 16) % 900000) + 10000;
};

export const generateToken = () => {
  return randomBytes(32).toString("hex");
};
