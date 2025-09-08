import { getUserById, updateUser } from "./../services/authService";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/req.type";
import { errorCode } from "../config/errorCode";
import { checkUserIfNotExit } from "../utils/auth";
import { errorFun } from "../utils/utilfunction/errorFun";
import {
  accessTokenOptions,
  refreshTokenOptions,
  tokenFun,
} from "../utils/utilfunction/tokenFun";

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
    return errorFun(next, {
      message: "You are unauthencicated.",
      status: 400,
      code: errorCode.unauthenticated,
    });
    // const error: any = new Error("You are unauthenticated.");
    // error.status = 400;
    // error.code = errorCode.unauthenticated;
    // return next(error);
  }

  // token rotation,after access token expired and
  const generateNewToken = async () => {
    try {
      let decoded;
      decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET!);
      const { id, email } = decoded as { id: string; email: string };
      const user = await getUserById(id);
      checkUserIfNotExit(user);

      if (user!.email !== email) {
        console.log(email);
        return errorFun(next, {
          message: "You are unauthenticated.",
          status: 401,
          code: errorCode.unauthenticated,
        });
      }

      if (user!.randomToken !== refreshToken) {
        return errorFun(next, {
          message: "You are unauthenticated.",
          status: 401,
          code: errorCode.unauthenticated,
        });
      }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        tokenFun(user);
      console.log(newAccessToken, newRefreshToken);
      const userData = {
        randomToken: newRefreshToken,
      };
      await updateUser(id, userData);

      res
        .cookie("accessToken", newAccessToken, accessTokenOptions)
        .cookie("refreshToken", newRefreshToken, refreshTokenOptions);
      req.userId === id;
      next();
    } catch (error: any) {
      return errorFun(next, {
        message: "Access Token is invalid.",
        status: 400,
        code: errorCode.attack,
      });
    }
  };
  // Before access Token is not expired,
  if (!accessToken) {
    return generateNewToken();
    //   return errorFun(next, {
    //     message: "Access token has expired.",
    //     status: 401,
    //     code: errorCode.unauthenticated,
    //   });
  }
  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET!) as {
      id: string;
    };
  } catch (error: any) {
    if (error.code === errorCode.accessTokenExpired) {
      return errorFun(next, {
        message: "Access token has expired.",
        status: 401,
        code: errorCode.unauthenticated,
      });
    } else {
      return errorFun(next, {
        message: "Access token has expired.",
        status: 401,
        code: errorCode.unauthenticated,
      });
    }
  }
  req.userId = decoded.id;
  next();
};
