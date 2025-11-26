export type Reaction = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

export type ReactionType = {
  id: string;
  type: Reaction;
  postId: string;
};
