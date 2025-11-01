import { Request, Response, NextFunction } from "express";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import {
  createOtp,
  getUserByEmail,
  getOtpByEmail,
  updateOtp,
  createUser,
  updateUser,
} from "../services/authService";
import {
  checkOtpErrorIfInSameDate,
  checkOtpRowExit,
  checkUserExit,
  checkUserIfNotExit,
} from "../utils/auth";
import { getUserById } from "./../services/authService";
import { generateOtp, generateToken } from "../utils/generate";
import { sendEmail } from "../utils/email";
import { Otp, User } from "../../generated/prisma";
import { isSameDate } from "../utils/utilFunction/sameDate";
import {
  accessTokenOptions,
  refreshTokenOptions,
  tokenFun,
} from "../utils/utilFunction/tokenFun";
import { errorCode } from "../config/errorCode";
import queue from "../job/queues/queue";
import { UserType } from "../types/user.type";

/*
 1. ) Email validation
 2. ) User have already registered before?.
 3. ) Otp generate 
 4. ) Otp hashing and creating in table
  a ) if otp isn't  in the table with this email, to create otp
  b ) if otp is in the table ,need to update the otp row

  c ) if not the same date, otp row create
  d ) if the same date and also count is 3 times, error return.
  e ) if the same date and valid count (count < 3), can get the otp
  Response (otp,email,rememberToken)
 */
export const register = [
  body("email").isEmail().withMessage("Please fill the valid email."),
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. ) Email validation
    const errors: any = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }
    const email = req.body.email;
    // 2. )User have already registered before?.
    const user = (await getUserByEmail(req.body.email)) as UserType;
    checkUserExit(user); //user.id !==undefined ,It will run

    // 3. ) Otp generate and sending
    const otp = generateOtp();
    const message = `Your otp is ${otp}.`;
    // const sendEmailData = {
    //   email,
    //   subject: "Your otp is valid for 10 mins.",
    //   message,
    // };

    // 4.) Otp hashing and creating in table
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(String(otp), salt);
    const token = generateToken();

    const isOtp = await getOtpByEmail(email);
    let result;
    if (!isOtp) {
      // 4.a ) if otp isn't  in the table with this email, create otp
      result = await createOtp({
        otp: hashedOtp,
        email,
        rememberToken: token,
      });
    } else {
      const otpId = isOtp.id;
      // 4.b ) if otp is in the table ,update opt row
      const isSameDay = isSameDate(isOtp!.updatedAt);
      checkOtpErrorIfInSameDate(isSameDay, isOtp.error);

      if (!isSameDay) {
        // 4.c ) if not the same date, otp row create
        const otpData = {
          otp: hashedOtp,
          rememberToken: token,
          count: 1,
          error: 0,
        };
        result = await updateOtp(otpId, otpData);
      } else {
        // 4.d ) if the same date and also count is 3 times, error return.
        if (isOtp.count === 3) {
          const error: any = new Error(
            "Otp is allowed to request 3 times pre day,so please try again tomorrow. "
          );
          error.status = 405;
          error.code = errorCode.overLimit;
          next(error);
        } else {
          // 4. e if the same date and valid limited count (count < 3), can get the otp
          const otpData = {
            otp: hashedOtp,
            rememberToken: token,
            count: {
              increment: 1,
            },
          };
          result = await updateOtp(otpId, otpData);
        }
      }
    }
    await queue.add("email", {
      type: "email",
      email,
      subject: "Your otp is valid for 10 mins.",
      message,
    });
    res.status(200).json({
      message: `We are sending otp to your ${email}`,
      token: result!.rememberToken,
      email: result!.email,
    });
  },
];

/*
//////////////Verify Otp Logic ////////////
  1. ) request are email,opt,token,
  2. ) By using email ,check otp row exit?
  3. ) Request is within the same date?
  4. ) Token is valid ? if invalid ,error strictly updating 5,
  5. ) check otp is the same or not the same? /(
    a.) !isMatched { 
     !theSameDate
     {error:1} : the same date {error+1} /,
    b.) isMatched { 
     update the otp table(verifyToken,error,count)
      
     Response {verifytoken,email}  
 */
export const verifyOtp = [
  body("email").isEmail().withMessage("Please fill the valid email."),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .trim()
    .withMessage("Your OTP invalid."),
  body("token").notEmpty().trim().escape().withMessage("Your token was wrong."),
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. ) request are email,opt,token,
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }
    const { email, otp, token } = req.body;
    const user = (await getUserByEmail(email)) as UserType;
    checkUserExit(user);

    //2. ) By using email ,check otp row exit?
    const isOtp: Otp | null = await getOtpByEmail(email);
    checkOtpRowExit(isOtp);
    const otpId = isOtp!.id;

    //3. ) Request Otp is within the same date?
    const isSameDay = isSameDate(isOtp!.updatedAt);
    checkOtpErrorIfInSameDate(isSameDay, isOtp!.error);

    //4. ) Token is valid ? if invalid ,error strictly updating 5,
    if (isOtp?.rememberToken !== token) {
      await updateOtp(otpId, { error: 5 });
      const error: any = new Error("Invalid token");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    //5. ) OTP lifetime and expiration
    const isExpired = moment().diff(isOtp!.updatedAt, "minutes") < 5;
    console.log(moment().diff(isOtp?.updatedAt, "minutes"));
    if (!isExpired) {
      const error: any = new Error("Your otp is expired.");
      error.status = 401;
      error.code = errorCode.otpExpired;
      return next(error);
    }

    const isMatched = await bcrypt.compare(otp, isOtp!.otp);
    if (!isMatched) {
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        await updateOtp(otpId, otpData);
      } else {
        const otpData = {
          error: {
            increment: 1,
          },
        };
        await updateOtp(otpId, otpData);
      }
      const error: any = new Error("Your otp is not same.");
      error.status = 401;
      error.code = errorCode.notMatched;
      return next(error);
    }
    const verifyToken = generateToken();
    const optData = {
      verifyToken,
      error: 0,
      count: 1,
    };
    const result = await updateOtp(otpId, optData);

    res.status(200).json({
      token: result?.verifyToken,
      email: result?.email,
    });
  },
];

/*
    Confirm Password Logic
    1. ) Request validation
    2. ) By using Email , check user exit in the user table and in the otp table
    3. ) If otp exit and  error === 5 , return error  
    4. ) If token is wrong, return error
    5. ) If request lifetime passed over 10 mins, return error

 */

export const confirmPassword = [
  body("email").isEmail().withMessage("Please fill the valid email."),
  body("password")
    .notEmpty()
    .trim()
    .matches("^[0-9]+[a-z0-9]?$")
    .isLength({ min: 10, max: 16 })
    .withMessage("Your password was wrong"),
  body("token").notEmpty().trim().escape().withMessage("Your token was wrong."),
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. ) Request validation
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = error.invalid;
      return next(error);
    }
    const { email, password, token } = req.body;

    // 2. ) By using Email , check user exit in the user table and in the otp table
    const isUser = (await getUserByEmail(email)) as UserType;
    checkUserExit(isUser);

    const isOtp = await getOtpByEmail(email);
    checkOtpRowExit(isOtp);
    const otpId = isOtp!.id;

    // 3. ) If otp exit and error === 5 , return error
    if (isOtp!.error === 5) {
      const error: any = new Error("This request may be attack!");
      error.status = 400;
      error.code = errorCode.attack;
      return next(error);
    }

    // 4. ) If token is wrong,
    if (token !== isOtp!.verifyToken) {
      const error: any = new Error("Invalid token!");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    // 5. ) If request lifetime passed over 10 mins, return error

    const requestIsExpired = moment().diff(isOtp?.updatedAt, "minutes") > 10;
    if (requestIsExpired) {
      const otpData = {
        error: {
          increment: 1,
        },
      };
      await updateOtp(otpId, otpData);

      const error: any = new Error("Request expired!");
      error.status = 403;
      error.code = errorCode.requestExpired;
      return next(error);
    }

    // 6. ) Start creating the user.
    //password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const randomToken = "replace soon";

    const userData = {
      email,
      passwordHash,
      randomToken,
    };

    let user = await createUser(userData);

    // const accessTokenPayload = { id: user.id };
    // const refreshTokenPayload = { id: user.id, email: user.email };

    // const accessToken = jwt.sign(
    //   accessTokenPayload,
    //   process.env.ACCESSTOKEN_SECRET!,
    //   {
    //     expiresIn: "15m",
    //   }
    // );
    // const refreshToken = jwt.sign(
    //   refreshTokenPayload,
    //   process.env.REFRESHTOKEN_SECRET!,
    //   {
    //     expiresIn: "30d",
    //   }
    // );
    const tokenObj: any = tokenFun(user);

    user = await updateUser(user!.id, { randomToken: tokenObj.refreshToken });
    res
      .cookie("accessToken", tokenObj.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", tokenObj.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .status(200)
      .json({
        message: "You've already successfully created an account.",
        data: user,
      });
  },
];

/*
  1. ) Request validation
  2. ) CheckUser exit,if not exit error
  3. ) User exit but account is freeze , error return
  4. ) Password is matched,
      if not match
    a.if not the same date, errorCount =1
    b.the same date, errorCount >= 3 , account freeze, else errorCount increase
 */

export const login = [
  body("email").isEmail().withMessage("Please fill the valid email."),
  body("password")
    .notEmpty()
    .trim()
    .matches("^[0-9]+[a-z0-9]?$")
    .withMessage("Your password was wrong."),
  async (req: Request, res: Response, next: NextFunction) => {
    //  1. ) Request validation
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const { email, password } = req.body;
    //  2. ) CheckUser exit,if not exit error
    let user;
    user = (await getUserByEmail(email)) as UserType;
    checkUserIfNotExit(user);
    const userId = user!.id as string;

    //  3. ) User exit but account is freeze , error return
    if (user!.status === "FREEZE") {
      const error: any = new Error(
        "Your account is Freeze.After 3 days later will open."
      );
      error.status = 400;
      error.code = errorCode.accountFreeze;
      return next(error);
    }

    //4. ) Password Matched
    const passwordIsMatched = await bcrypt.compare(
      password,
      user!.passwordHash
    );
    // If password does not match,
    1;
    if (!passwordIsMatched) {
      const isTheSameDate = isSameDate(user!.updatedAt);
      if (!isTheSameDate) {
        const updatedUserData = {
          errorCount: 1,
        };
        await updateUser(userId, updatedUserData);
      } else {
        if (user!.errorCount >= 3) {
          const updatedUserData = {
            status: "FREEZE",
          };
          await updateUser(userId, updatedUserData);
        } else {
          const updatedUserData = {
            errorCount: {
              increment: 1,
            },
          };
          await updateUser(userId, updatedUserData);
        }
      }
      const error: any = new Error("Your password does not match.");
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const { accessToken, refreshToken } = tokenFun(user);

    user = await updateUser(userId, { randomToken: refreshToken });

    res
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .status(201)
      .json({
        message: "Your account successfully logged in.",
        userId: user!.id,
      });
  },
];

/*
   Logout Action 
  1. ) Check the user exit by using refresh Token .
  2. ) And clear cookies
  3. ) Update the ramdomToken
*/

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  if (!refreshToken) {
    const error: any = new Error("You are unauthenticated.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    next(error);
  }
  let decoded;
  try {
    decoded = (await jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN_SECRET!
    )) as { id: string; email: string };
  } catch (err) {
    const error: any = new Error("You are unauthenticated.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    next(error);
  }

  const { id, email } = decoded!;
  const user = (await getUserById(id)) as UserType;
  checkUserIfNotExit(user);

  if (user?.email !== email) {
    const error: any = new Error("You are unauthenticated.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    next(error);
  }
  const userData = {
    randomToken: refreshToken,
  };
  await updateUser(id, userData);
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.status(201).json({
    message: "You can successfully logout.",
  });
};
