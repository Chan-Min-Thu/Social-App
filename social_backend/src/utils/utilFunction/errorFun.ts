import { ErrorType } from "@/types/error.type";

export const errorFun = (err: ErrorType) => {
  const error: any = new Error(err.message);
  error.status = err.status;
  error.code = err.code;
  return error;
};
