import { prisma as PrismaClient } from "../config/prisma";
import { PostType } from "../types/post.type";

const prisma = PrismaClient.$extends({
  result: {
    post: {
      updatedAt: {
        need: { updatedAt: true },
        compute(post) {
          return post.updatedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    },
  },
});
export const createPost = (postData: PostType) => {
  const post = {
    title: postData.title,
    content: postData.content,
    author: {
      connect: { id: postData.authorId },
    },
  };
  return prisma.post.create({
    data: post,
  });
};

export const createImage = (
  imageData: {
    imageUrl: string;
    postId: string;
  }[]
) => {
  return prisma.image.createMany({
    data: imageData,
  });
};

export const deleteImage = (postId: string) => {
  return prisma.image.deleteMany({
    where: {
      postId,
    },
  });
};
export const updatePost = (postData: any) => {
  return prisma.post.update({
    where: { id: postData.id },
    data: postData,
  });
};

export const getPostById = (id: string) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      image: true,
    },
  });
};

export const getPostByIdWithRelation = (id: string) => {
  console.log("post id in service", id);
  return prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      image: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          userId: true,
        },
      },
    },
  });
};
export const deletePostById = async (postId: string) => {
  await prisma.image.deleteMany({
    where: { postId },
  });
  return prisma.post.delete({
    where: { id: postId },
  });
};

export const getPostsByInfinite = async (options: any) => {
  if (options.cursor.id) {
    console.log(options);
    return prisma.post.findMany(options);
  }
};
