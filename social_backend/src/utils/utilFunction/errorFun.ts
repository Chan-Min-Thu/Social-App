import { NextFunction } from "express";

export const errorFun = (next: NextFunction, err: any) => {
  const error: any = new Error(err.message);
  error.status = err.status;
  error.code = err.code;
  return next(error);
};
