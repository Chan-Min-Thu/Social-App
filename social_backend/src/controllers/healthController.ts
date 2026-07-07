import { Request, Response, NextFunction } from "express";

export const healthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("=== Health Check ===");
  res.status(200).json({
    message: "Everything is Ok.",
  });
};
