import { Comment } from "../../generated/prisma";
import { prisma } from "../config/prisma";

export const createComment = (commentData: any) => {
  return prisma.comment.create({
    data: commentData,
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
