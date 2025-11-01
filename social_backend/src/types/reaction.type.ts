import { $Enums } from "../../generated/prisma";

export interface ReactionType {
  id?: string;
  type: $Enums.ReactionType;
  userId: string;
  postId?: string;
  commentId?: string;
  storyId?: string;
  createdAt?: Date;
}

export interface UpdateReactionType extends ReactionType {}
