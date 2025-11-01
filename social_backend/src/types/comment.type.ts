export interface CommentType {
  id?: string;
  content: string;
  postId: string;
  parentId?: string;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
