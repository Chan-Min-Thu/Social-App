import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { limiter } from "./middlewares/rateLimiter";
import authRoute from "./routes/v1/auth";
import postRoute from "./routes/v1/post/post";
import reactionRoute from "./routes/v1/reaction/reaction";
import commentRoute from "./routes/v1/comment/comment";
import friendRoute from "./routes/v1/friend/friend";
import profileRoute from "./routes/v1/profile/profile";
import healthRoute from "./routes/v1/health";
import { auth } from "./middlewares/auth";

export const app = express();

const whitelist = ["http://example1.com", "http://localhost:5173"];
const corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors(corsOptions))
  .use(helmet())
  .use(compression())
  .use(limiter)
  .use(cookieParser())
  .use(express.static("uploads/optimized"));

app.use("/api/v1", authRoute);
app.use("/api/v1", auth, postRoute);
app.use("/api/v1", auth, reactionRoute);
app.use("/api/v1", auth, commentRoute);
app.use("/api/v1", auth, friendRoute);
app.use("/api/v1", auth, profileRoute);
app.use("/api/v1", healthRoute);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Server Error";
  const errorCode = error.code || "Error_code";

  res.status(status).json({
    error: errorCode,
    message,
  });
});
