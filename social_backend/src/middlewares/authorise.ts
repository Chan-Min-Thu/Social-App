import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/req.type";

export const authorise = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  next();
};
