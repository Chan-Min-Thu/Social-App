import { NextFunction, Response } from "express";
import { body, validationResult } from "express-validator";
import { CustomRequest } from "../../types/req.type";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import { getPostById } from "../../services/postService";
import {
  checkPostById,
  checkReactionById,
  checkReactionExit,
} from "../../utils/check";
import { checkUserIfNotExit } from "./../../utils/auth";
import {
  createReaction,
  deleteReaction,
  getReactionById,
  getReactionByUserIdAndPostId,
  updateReaction,
} from "../../services/reactionService";
import { reqbodyErrorFn } from "../../utils/utilfunction/reqbodyError";

export const createReactionController = [
  body("type").notEmpty(),
  body("userId").isUUID(),
  body("postId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);

    const userId = req.userId;
    const { postId, type } = req.body;

    const user = await getUserById(userId!);
    checkUserIfNotExit(user);

    const post = await getPostById(postId);
    checkPostById(post);

    const isReaction = await getReactionByUserIdAndPostId({ userId, postId });
    checkReactionExit(isReaction);

    const reactionData = {
      type,
      userId,
      postId,
    };
    const reaction = await createReaction(reactionData);
    res.status(200).json({
      message: "Your reaction is successfully created.",
      data: { reaction },
    });
  },
];

export const updateReactionController = [
  body("id").isUUID(),
  body("type").notEmpty(),
  body("userId").isUUID(),
  body("postId").isUUID().withMessage({ message: "Invalid request" }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);

    const userId = req.userId;
    const { postId, type, id } = req.body;

    const user = await getUserById(userId!);
    checkUserIfNotExit(user);

    const post = await getPostById(postId);
    checkPostById(post);

    console.log(id);
    const isReaction = await getReactionById(id);
    console.log(isReaction);
    checkReactionById(isReaction);

    if (type === "") {
      await deleteReaction(id);
      return res.status(203).json({
        message: "Your reaction is deleted.",
      });
    } else {
      const reactionData = {
        id,
        type,
        userId,
        postId,
      };
      const reaction = await updateReaction(reactionData);
      res.status(200).json({
        message: "Your reaction is successfully updated.",
        data: { reaction },
      });
    }
  },
];
