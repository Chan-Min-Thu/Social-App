export type Reaction = "LOVE";

export type ReactionType = {
  id: string;
  type: Reaction;
  postId?: string;
  userId: string;
};

export type CreateReactionType = {
  postId: string;
  type: string;
};
