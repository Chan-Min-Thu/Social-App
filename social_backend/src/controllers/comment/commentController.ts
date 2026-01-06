import { Response, NextFunction } from "express";
import { body, param } from "express-validator";
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
import { reqBodyErrorFn } from "../../utils/utilFunction/reqBodyError";
import { PostType } from "../../types/post.type";
import { CommentType } from "../../types/comment.type";
import { crossOriginOpenerPolicy } from "helmet";

export const createCommentController = [
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val))
    .withMessage("Your content does not match."),
  body("postId").isUUID().withMessage("Your postId is wrong."),
  body("parentId").isUUID().optional().withMessage("Your parentId is wrong."),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Validation Request
    if (reqBodyErrorFn(req, next)) return;
    const authorId = req.userId as string;
    const { content, postId, parentId } = req.body;

    const isReply = !!parentId;

    //Check post exit or not exit;
    const post = (await getPostById(postId!)) as PostType;
    checkPostById(post);

    // Comment create with prisma
    let comment;
    if (!isReply) {
      const commentData = {
        content,
        authorId,
        postId,
      };
      comment = await createComment(commentData);
      //Reply comments
    } else {
      const isComment = (await getCommentById(parentId)) as CommentType;
      isComment;
      checkCommentIfNotExit(isComment);

      const commentData = {
        content,
        authorId,
        postId,
        parentId,
      };
      comment = await createComment(commentData);
    }
    return res.status(201).json({
      message: "Your comment is successfully created.",
      data: comment,
    });
  },
];

export const updateCommentController = [
  param("commentId").isUUID().withMessage("Your comment id is wrong."),
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("authorId").isUUID().withMessage("Yor"),
  body("postId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Validation Request
    if (reqBodyErrorFn(req, next)) return;
    const authorId = req.userId;
    const commentId = req.params.commentId as string;
    const { content, postId } = req.body;

    //Check post exit or not exit;
    const post = (await getPostById(postId!)) as PostType;
    checkPostById(post);

    // Check comment exit or not exit;
    const isComment = (await getCommentById(commentId)) as CommentType;
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
      data: comment,
    });
  },
];

export const deleteCommentController = [
  body("commentId").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (reqBodyErrorFn(req, next)) return;
    const authorId = req.userId;
    const { commentId } = req.body;

    const isComment = (await getCommentById(commentId)) as CommentType;
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
