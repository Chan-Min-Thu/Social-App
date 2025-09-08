import { Response, NextFunction } from "express";
import { body } from "express-validator";
import sanitizeHtml from "sanitize-html";
import { CustomRequest } from "../../types/req.type";
import { errorCode } from "../../config/errorCode";
import { getPostById } from "../../services/postService";
import {
  createComment,
  deleteComment,
  getCommentById,
  updateComment,
} from "../../services/commentService";
import { checkCommentIfNotExit, checkPostById } from "../../utils/check";
import { reqbodyErrorFn } from "../../utils/utilfunction/reqbodyError";

export const createCommentController = [
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("postId").isUUID(),
  body("parentId").isULID().optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Validation Request
    reqbodyErrorFn(req, next);

    const authorId = req.userId;
    const { content, postId, parentId } = req.body;

    //Check post exit or not exit;
    const post = await getPostById(postId!);
    checkPostById(post);

    // Comment create with prisma
    let comment;
    if (parentId) {
      //Reply comments
      const isComment = await getCommentById(parentId);
      checkCommentIfNotExit(isComment);

      const commentData = {
        content,
        authorId,
        postId,
        parentId,
      };
      comment = await createComment(commentData);
    } else {
      //Parents Comments
      const commentData = {
        content,
        authorId,
        postId,
      };
      comment = await createComment(commentData);
    }

    //Response
    res.status(201).json({
      message: "Your comment is successfully created.",
      data: { comment },
    });
  },
];

export const updateCommentController = [
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("commentId").isUUID(),
  body("authorId").isUUID(),
  body("postId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Validation Request
    reqbodyErrorFn(req, next);
    const authorId = req.userId;
    const { content, postId, commentId } = req.body;

    //Check post exit or not exit;
    const post = await getPostById(postId!);
    checkPostById(post);

    // Check comment exit or not exit;
    const isComment = await getCommentById(commentId);
    checkCommentIfNotExit(isComment);

    const commentData = {
      id: commentId,
      content,
      postId,
      authorId,
    };

    const comment = await updateComment(commentData);
    //Response
    res.status(200).json({
      message: "Your comment is successfully updated.",
      data: { comment },
    });
  },
];

export const deleteCommentController = [
  body("commentId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const authorId = req.userId;
    const { commentId } = req.body;

    const isComment = await getCommentById(commentId);
    checkCommentIfNotExit(isComment);

    if (isComment?.authorId !== authorId) {
      return next({
        message: "You cannot delete this comment.",
        status: 403,
        code: errorCode.notMatched,
      });
    }

    await deleteComment(commentId);
    res.status(201).json({
      message: "Your comment is successfully deleted",
    });
  },
];
