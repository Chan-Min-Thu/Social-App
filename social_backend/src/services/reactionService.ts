import { prisma } from "../config/prisma";

export const createReaction = (reactionData: any) => {
  return prisma.reaction.create({
    data: reactionData,
  });
};

export const updateReaction = (reactionData: any) => {
  return prisma.reaction.update({
    where: { id: reactionData.id },
    data: reactionData,
  });
};
export const deleteReaction = (id: string) => {
  return prisma.reaction.delete({
    where: { id },
  });
};
export const getReactionById = (id: any) => {
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
