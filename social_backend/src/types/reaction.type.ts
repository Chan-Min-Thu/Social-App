import type { ReactionType as PrismaReactionType } from "../../generated/prisma/enums";

export interface ReactionType {
  id?: string;
  type: PrismaReactionType;
  userId: string;
  postId?: string;
  commentId?: string;
  storyId?: string;
  createdAt?: Date;
}

export interface UpdateReactionType extends ReactionType {}
