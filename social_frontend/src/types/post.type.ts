import type { CommentType } from "./comment.type";
import type { ReactionType } from "./reaction.type";
import type { UserType } from "./user.type";

export type ImageType = {
  id: string;
  imageUrl: string;
};

export interface PostType {
  id?: string;
  title: string;
  content: string;
  updatedAt: Date;
  author?: UserType;
  comments?: CommentType[];
  reactions?: ReactionType[] | [] | undefined;
  image: ImageType[] | [];
}
