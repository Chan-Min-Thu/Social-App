export interface PostType {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date | string;
  image?: Image[];
}

export interface UpdatedPost extends PostType {
  id: string;
  postData: PostType;
}

export interface Image {
  id: string;
  imageUrl: string;
}
