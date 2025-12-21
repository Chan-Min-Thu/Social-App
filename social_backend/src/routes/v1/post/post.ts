import express from "express";
import {
  createPostController,
  updatePostController,
  deletePostController,
  getPostByIdController,
  getPostByInfiniteScrollController,
} from "../../../controllers/post/postController";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";

const router = express.Router();

router.get("/posts/cursor-pagination", getPostByInfiniteScrollController);
router.get("/posts/:postId", getPostByIdController);
router.post("/posts", uploadMemory.array("images", 4), createPostController);
router.patch(
  "/posts/:postId",
  uploadMemory.array("images", 4),
  updatePostController
);
router.delete("/posts", deletePostController);

export default router;
