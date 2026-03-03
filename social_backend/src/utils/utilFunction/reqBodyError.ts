import { Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { errorCode } from "@/config/errorCode";

export const reqBodyErrorFn = (req: Request, next: NextFunction) => {
  const errors = validationResult(req).array({ onlyFirstError: true });
  if (errors.length > 0) {
    return next({
      message: errors[0].msg,
      status: 400,
      code: errorCode.invalid,
    });
  }
  return false;
};
