import jwt from "jsonwebtoken";
import { TokenOptionType } from "../../types/general.type";

export const tokenFun = (data: any) => {
  const accessToken = jwt.sign(
    { id: data.id },
    process.env.ACCESSTOKEN_SECRET!,
    {
      expiresIn: 60 * 15,
    }
  );
  const refreshToken = jwt.sign(
    { id: data.id, email: data.email },
    process.env.REFRESHTOKEN_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  return { accessToken, refreshToken };
};

export const accessTokenOptions: TokenOptionType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : ("strict" as const),
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenOptions: TokenOptionType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : ("strict" as const),
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
