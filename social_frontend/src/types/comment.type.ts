// id        String     @id @default(uuid())
//   content   String
//   createdAt DateTime   @default(now())
//   updatedAt DateTime   @updatedAt
//   author    User       @relation(fields: [authorId], references: [id])
//   authorId  String
//   post      Post       @relation(fields: [postId], references: [id])
//   postId    String
//   reaction  Reaction[]
//   parentId  String?
//   parent    Comment?   @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
//   replies   Comment[]  @relation("CommentReplies")

export interface comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  postId: string;
}
