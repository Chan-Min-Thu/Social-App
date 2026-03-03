import express, { NextFunction, Request, Response } from "express";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoute from "@/routes/v1/auth";
import postRoute from "@/routes/v1/post/post";
import reactionRoute from "@/routes/v1/reaction/reaction";
import commentRoute from "@/routes/v1/comment/comment";
import friendRoute from "@/routes/v1/friend/friend";
import profileRoute from "@/routes/v1/profile/profile";
import healthRoute from "@/routes/v1/health";
import { limiter } from "@/middlewares/rateLimiter";
import { auth } from "@/middlewares/auth";
import { ErrorType } from "@/types/error.type";
// You don't need to change imports in this file — change how TypeScript is compiled / run.
// Recommended options (change tsconfig.json / package.json or your runtime):
// 1) Compile to CommonJS and run the compiled output with Node:
//    tsconfig.json: { "compilerOptions": { "module": "CommonJS", ... } }
//    Node's require-based resolution lets you omit file extensions in imports.
// 2) Use a bundler/dev server (Vite, Webpack, Bun) or ts-node in CommonJS mode — they resolve extensionless imports.
// Note: If you run native Node ESM (package.json "type": "module"), Node requires explicit file extensions for local imports.
export const app = express();

const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void,
  ) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  // origin: "http://localhost:5173",
  // credentials: true,
};

app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(cors(corsOptions))
  .use(express.json())
  .use(helmet())
  .use(compression())
  .use(limiter)
  .use(cookieParser())
  .use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  })
  .use(express.static("uploads"));

app.use("/api/v1", express.static("uploads"));
app.use("/api/v1", healthRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", auth, postRoute);
app.use("/api/v1", auth, reactionRoute);
app.use("/api/v1", auth, commentRoute);
app.use("/api/v1", auth, friendRoute);
app.use("/api/v1", auth, profileRoute);

app.use((error: ErrorType, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message || "Server Error";
  const errorCode = error.code || "Error_code";

  return res.status(status).json({
    error: errorCode,
    message,
  });
});
