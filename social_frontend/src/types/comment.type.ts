import type { UserType } from "./user.type";

export interface CommentType {
  id?: string;
  content: string;
  parentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: UserType;
  postId?: string;
}
