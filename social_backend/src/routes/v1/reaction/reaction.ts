import express from "express";
import {
  createReactionController,
  updateReactionController,
} from "../../../controllers/reaction/reactionController";

const router = express.Router();

router.post("/reactions", createReactionController);
router.patch("/reactions", updateReactionController);

export default router;
