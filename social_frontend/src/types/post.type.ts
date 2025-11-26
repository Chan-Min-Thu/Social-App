// id        String     @id @default(uuid())
//   title     String
//   content   String
//   createdAt DateTime   @default(now())
//   updatedAt DateTime   @updatedAt
//   author    User       @relation(fields: [authorId], references: [id])
//   authorId  String
//   comments  Comment[]
//   reactions Reaction[]

import type { comment } from "./comment.type";
import type { ReactionType } from "./reaction.type";

//   image     Image[]
export type ImageType = {
  id: string;
  imageUrl: string;
};

export interface PostType {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
  };
  comments?: comment[];
  reactions?: ReactionType[];
  image: ImageType[] | [];
}
