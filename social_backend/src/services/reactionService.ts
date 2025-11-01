import { ReactionType, UpdateReactionType } from "../types/reaction.type";
import { prisma } from "../config/prisma";

export const createReaction = (reactionData: ReactionType) => {
  console.log(reactionData);
  return prisma.reaction.create({
    data: {
      type: reactionData.type,
      userId: reactionData.userId,
      postId: reactionData.postId,
    },
  });
};

export const updateReaction = (reactionData: UpdateReactionType) => {
  return prisma.reaction.update({
    where: { id: reactionData.id },
    data: {
      type: reactionData.type,
      userId: reactionData.userId,
      postId: reactionData.postId,
    },
  });
};
export const deleteReaction = (id: string) => {
  return prisma.reaction.delete({
    where: { id },
  });
};
export const getReactionById = (id: string) => {
  console.log(id);
  return prisma.reaction.findUnique({
    where: { id },
  });
};

export const getReactionByUserIdAndPostId = (ids: any) => {
  return prisma.reaction.findFirst({
    where: {
      userId: ids.userId,
      postId: ids.postId,
    },
  });
};
