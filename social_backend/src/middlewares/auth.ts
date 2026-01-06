import { getUserById, updateUser } from "./../services/authService";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/req.type";
import { errorCode } from "../config/errorCode";
import { checkUserIfNotExit } from "../utils/auth";
import { errorFun } from "../utils/utilFunction/errorFun";
import {
  accessTokenOptions,
  refreshTokenOptions,
  tokenFun,
} from "../utils/utilFunction/tokenFun";
import { UserType } from "../types/user.type";
import { User } from "../../generated/prisma/client";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  // const isMobile = req.header("x-platform");
  // if (isMobile === "mobile") {
  //   const accessToken = req.headers.authorization?.split(" ")[1];
  //   console.log("mobile");
  // } else {
  //   console.log("web");
  // }

  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  if (!refreshToken) {
    console.log("refreshToken does not exit.");
    return next(
      errorFun({
        message: "You are unauthenticated.",
        status: 401,
        code: errorCode.unauthenticated,
      })
    );
  }

  // token rotation,after access token expired and
  const generateNewToken = async () => {
    let decoded;
    try {
      decoded = (await jwt.verify(
        refreshToken,
        process.env.REFRESHTOKEN_SECRET!
      )) as { id: string; email: string };
    } catch (error) {
      return next(
        errorFun({
          message: "Token is invalid.",
          status: 400,
          code: errorCode.attack,
        })
      );
    }

    const user = (await getUserById(decoded.id)) as UserType;
    checkUserIfNotExit(user);

    if (user.email !== decoded.email) {
      return next(
        errorFun({
          message: "You are unauthenticated.",
          status: 401,
          code: errorCode.unauthenticated,
        })
      );
    }
    if (user.randomToken !== refreshToken) {
      return next(
        errorFun({
          message: "You are unauthenticated.",
          status: 401,
          code: errorCode.unauthenticated,
        })
      );
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokenFun({ id: user.id!, email: user.email });
    const userData = {
      randomToken: newRefreshToken,
    };
    await updateUser(decoded.id, userData);
    res
      .cookie("accessToken", newAccessToken, accessTokenOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokenOptions);
    req.userId = decoded.id;
    next();
  };

  // Before access Token is not expired,
  if (!accessToken) {
    console.log("accessToken does not exit");
    generateNewToken();
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET!) as {
        id: string;
      };
      if (!decoded) {
        return next(
          errorFun({
            message: "User id does not exit.",
            status: 401,
            code: errorCode.unauthenticated,
          })
        );
      }
      req.userId = decoded.id;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        generateNewToken();
      } else {
        return next(
          errorFun({
            message: "Access token has expired.",
            status: 401,
            code: errorCode.unauthenticated,
          })
        );
      }
    }
  }
};
