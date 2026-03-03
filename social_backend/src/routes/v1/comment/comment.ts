import express from "express";
import {
  createCommentController,
  deleteCommentController,
  updateCommentController,
} from "@/controllers/comment/commentController";

const router = express.Router();

router.post("/comments", createCommentController);
router.patch("/comments/:commentId", updateCommentController);
router.delete("/comments", deleteCommentController);

export default router;
