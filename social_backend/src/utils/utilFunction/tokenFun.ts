import jwt from "jsonwebtoken";
import { TokenOptionType } from "../../types/general.type";

type TokenInputType = { id: string; email: string };

export const tokenFun = ({ ...data }: TokenInputType) => {
  const accessToken = jwt.sign(
    { id: data.id },
    process.env.ACCESSTOKEN_SECRET!,
    {
      expiresIn: 60 * 2 * 1000,
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
  maxAge: 2 * 60 * 1000,
  path: "/",
};

export const refreshTokenOptions: TokenOptionType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite:
    process.env.NODE_ENV === "production" ? "none" : ("strict" as const),
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};
