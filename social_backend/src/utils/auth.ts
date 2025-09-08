import { errorCode } from "../config/errorCode";

/*
 checkOtpErrorIfInSameDate,
  checkOtpRowExit,
  checkUserExit,
  checkUserIfNotExit,
 */
export const checkUserExit = (user: any) => {
  if (user) {
    const error: any = new Error("Your email has already registered.");
    error.status = 409;
    error.code = errorCode.userExit;
    throw error;
  }
};

export const checkUserIfNotExit = (user: any) => {
  if (!user) {
    const error: any = new Error("Your email does not register.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    throw error;
  }
};

export const checkOtpErrorIfInSameDate = (
  isSameDate: boolean,
  error: number
) => {
  if (isSameDate && error === 5) {
    const error: any = new Error("Your otp request is over limited for today.");
    error.status = 403;
    error.code = errorCode.otpExpired;
    throw error;
  }
};

export const checkOtpRowExit = (otp: any) => {
  if (!otp) {
    const error: any = new Error("Invalid request.");
    error.status = 400;
    error.code = errorCode.invalid;
    throw error;
  }
};
