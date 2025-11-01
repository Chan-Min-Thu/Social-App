import { NextFunction, Response } from "express";
import { body, param, validationResult } from "express-validator";
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
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
import { UserType } from "../../types/user.type";
import { PostType } from "../../types/post.type";
import { ReactionType } from "../../types/reaction.type";

const reaction = {
  LOVE: "LOVE",
  LIKE: "LIKE",
  HAHA: "HAHA",
  WOW: "WOW",
  SAD: "SAD",
  ANGRY: "ANGRY",
};

const allowedReaction = Object.values(reaction);

export const createReactionController = [
  body("type")
    .isIn(allowedReaction)
    .withMessage("Reaction must be allowed field."),
  body("postId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;

    const userId = req?.userId as string;
    const { postId, type } = req.body;

    const user = (await getUserById(userId!)) as UserType;
    checkUserIfNotExit(user);

    const post = (await getPostById(postId)) as PostType;
    checkPostById(post);

    const isReaction = (await getReactionByUserIdAndPostId({
      userId,
      postId,
    })) as ReactionType;
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
  param("reactionId").isUUID(),
  body("type")
    .isIn(allowedReaction)
    .withMessage("Reaction must be allowed field.")
    .optional(),
  // body("userId").isUUID(),j
  body("postId").isUUID().withMessage({ message: "Invalid request" }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;

    const userId = req.userId as string;
    const reactionId = req.params.reactionId;
    const { postId, type } = req.body;

    const user = (await getUserById(userId!)) as UserType;
    checkUserIfNotExit(user);

    const post = (await getPostById(postId)) as PostType;
    checkPostById(post);

    const isReaction = await getReactionById(reactionId);
    checkReactionById(isReaction);

    const isSuccessor = isReaction?.userId === user.id;
    if (isSuccessor) {
      if (type === "") {
        await deleteReaction(reactionId);
        return res.status(203).json({
          message: "Your reaction is deleted.",
        });
      } else {
        const reactionData = {
          id: reactionId,
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
    } else {
      const error: any = new Error("This reaction does not belong you.");
      error.status = 400;
      error.code = errorCode.unauthenticated;
      throw error;
    }
  },
];
