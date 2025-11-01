// id        String     @id @default(uuid())
//   title     String
//   content   String
//   createdAt DateTime   @default(now())
//   updatedAt DateTime   @updatedAt
//   author    User       @relation(fields: [authorId], references: [id])
//   authorId  String
//   comments  Comment[]
//   reactions Reaction[]
//   image     Image[]
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}
