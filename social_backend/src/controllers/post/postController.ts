import { Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import sanitizeHtml, { options } from "sanitize-html";
import { CustomRequest } from "../../types/req.type";
import {
  createImage,
  createPost,
  deleteImage,
  deletePostById,
  getPostById,
  getPostByIdWithRelation,
  getPostsByInfinite,
  updatePost,
} from "../../services/postService";
import { checkfile, checkPostById } from "../../utils/check";
import path from "path";
import { unlink } from "fs";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExit } from "../../utils/auth";
import queue from "../../job/queues/queue";
import { reqbodyErrorFn } from "../../utils/utilfunction/reqbodyError";

export const getAllPostsController = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  res.status(200).json({
    userId,
    message: "All Posts.",
  });
};

export const createPostController = [
  body("title")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = String(req.userId);
    const { title, content } = req.body;
    const images = req.files;
    checkfile(images);

    const createdPost = await createPost({
      title,
      content,
      authorId: userId,
    });

    console.log(createdPost);

    const imagesData =
      Array.isArray(images) && images.length > 0
        ? await Promise.all(
            images.map(async (image: any) => {
              console.log("image data", image);
              await queue.add(
                "optimized-image",
                {
                  type: "image",
                  filePath: image.buffer.toString("base64"),
                  fileName: image.originalname,
                  width: 500,
                  height: 600,
                  qualitity: 100,
                },
                {
                  attempts: 3,
                  backoff: {
                    type: "exponential", //"fixed"
                    delay: 1000,
                  },
                }
              );
              return {
                imageUrl: `${image.originalname.split(".")[0]}.webp`,
                postId: createdPost.id,
              };
            })
          )
        : [];
    await createImage(imagesData);
    const postWithImage = await getPostById(createdPost.id);
    res.status(200).json({
      message: "Post is successfully created.",
      data: { post: postWithImage },
    });
  },
];

export const updatePostController = [
  body("id").notEmpty().trim(),
  body("title")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("content")
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((val) => sanitizeHtml(val)),
  body("authorId").notEmpty().trim(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = req.userId;
    const { title, content, id } = req.body;
    const images = req.files;
    checkfile(images);

    const post = await getPostById(id);
    console.log(post);
    if (post) {
      post.image.map(async (img) => {
        const imgUrl = img.imageUrl;
        try {
          const imagePath = path.join(
            __dirname,
            "../../../",
            "uploads/optimized",
            imgUrl
          );
          await unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        } catch (error) {
          res.status(500).json({
            message: "Your images delete error.",
          });
          return;
        }
      });
    }

    try {
      if (post?.image) {
        await Promise.all(
          post.image.map((img) => {
            const originalPath = path.join(
              __dirname,
              "../../..",
              "uploads/optimized",
              img.imageUrl
            );
            unlink(originalPath, (err) => console.log(err));
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
    checkPostById(post);
    const updatedpost = await updatePost({
      title,
      content,
      authorId: userId,
      id,
    });

    // images data mapping and optimized with queue,job,worker
    const imagesData =
      Array.isArray(images) && images.length > 0
        ? Promise.all(
            images.map(async (image: any) => {
              await queue.add(
                "optimized-image",
                {
                  filePath: image.buffer.toString("base64"), // you need to change buffer file to base64 because when buffer is transfer to redis server, there has potential issues just like normalization and denormalization.
                  fileName: image.originalname,
                  width: 500,
                  height: 600,
                  qualitity: 100,
                },
                {
                  attempts: 3,
                  backoff: {
                    type: "exponential",
                    delay: 1000,
                  },
                }
              );
              return {
                imageUrl: `${image.originalname.split(".")[0]}.webp`,
                postId: updatedpost.id,
              };
            })
          )
        : [];
    await deleteImage(req.body.id);
    await createImage(await imagesData);
    const updatedPostWithImage = await getPostById(id);

    res.status(200).json({
      message: "Post is successfully updated.",
      data: { post: updatedPostWithImage },
    });
  },
];

export const deletePostController = [
  body("id").isUUID(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    reqbodyErrorFn(req, next);
    const userId = String(req.userId);
    const postId = req.body.id;
    const user = await getUserById(userId);
    checkUserIfNotExit(user);

    const post = await getPostById(postId);
    checkPostById(post);

    if (post) {
      post.image.map(async (img) => {
        const imgUrl = img.imageUrl;
        try {
          const imagePath = path.join(
            __dirname,
            "../../../",
            "uploads/images",
            imgUrl
          );
          await unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        } catch (error) {
          res.status(500).json({
            message: "Your images delete error.",
          });
          return;
        }
      });
      await deletePostById(postId);
    }

    res.status(201).json({
      message: "Your post is successfully deleted.",
    });
  },
];

export const getPostByIdController = [
  param("postId", "PostId is required.").notEmpty(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req.params).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next({
        message: errors[0].msg,
        status: 400,
        code: errorCode.invalid,
      });
    }

    const { postId } = req.params;
    const userId = req.userId;

    const user = await getUserById(userId!);
    checkUserIfNotExit(user);

    const post = await getPostByIdWithRelation(String(postId));
    res.status(200).json({
      message: "Post get successfully.",
      data: { post },
    });
  },
];

export const getPostByInfiniteScrollController = [
  query("lastCursor").optional().isString(),
  query("take").optional().isString(),
  query("skip").optional().isString(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next({
        message: errors[0].msg,
        status: 400,
        code: errorCode.invalid,
      });
    }

    const userId = req.userId;
    const { lastCursor, take, skip } = req.query;
    const user = await getUserById(userId!);
    checkUserIfNotExit(user);

    const options = {
      take: Number(take) + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: lastCursor as string } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        image: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
          },
        },
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    };

    const posts = await getPostsByInfinite(options);

    const hasNextPage = posts!.length > Number(take);

    if (hasNextPage) {
      posts?.pop();
    }
    const newCursor = posts!.length > 0 ? posts![posts!.length - 1].id : null;

    console.log("hello infinite posts");
    res.status(200).json({
      message: "Infinite posts successfully got.",
      length: posts?.length,
      data: {
        hasNextPage,
        newCursor,
        posts,
      },
    });
  },
];
