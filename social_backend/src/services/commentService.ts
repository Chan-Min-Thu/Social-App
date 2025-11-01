import { prisma } from "../config/prisma";
import { CommentType } from "../types/comment.type";

export const createComment = (commentData: CommentType) => {
  const { content, authorId, postId, parentId } = commentData;

  if (!authorId || !postId) {
    throw new Error("authorId and postId are required to create a comment");
  }

  return prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
      parentId: parentId ?? null,
    },
  });
};

export const updateComment = (commentData: any) => {
  return prisma.comment.update({
    where: { id: commentData.id },
    data: commentData,
  });
};

export const deleteComment = (commentId: string) => {
  return prisma.comment.deleteMany({
    where: { id: commentId },
  });
};

export const getCommentById = (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};
