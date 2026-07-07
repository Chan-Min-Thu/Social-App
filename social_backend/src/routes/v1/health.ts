import express from "express";
import { healthCheck } from "@/controllers/healthController";

const router = express.Router();

router.get(
  "/health",
  (req, res, next) => {
    console.log("hello health check");
    next();
  },
  healthCheck,
);

export default router;
