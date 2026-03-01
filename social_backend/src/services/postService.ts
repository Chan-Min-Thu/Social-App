import { skip } from "node:test";
import { prisma as PrismaClient } from "../lib/prisma";
import { PostType, UpdatedPost } from "../types/post.type";

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
  }[],
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
export const updatePost = (postData: PostType) => {
  return prisma.post.update({
    where: { id: postData.id },
    data: {
      title: postData.title,
      content: postData.content,
      authorId: postData.authorId,
    },
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

const optionsDefault = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      avatarUrl: true,
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
      postId: true,
      parentId: true,
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  },
  reactions: {
    select: {
      id: true,
      type: true,
      userId: true,
    },
  },
};

export const getPostsByInfinite = async (options: any) => {
  if (options.cursor.id) {
    return prisma.post.findMany({
      cursor: { id: options.cursor.id },
      skip: 1,
      take: options.take,
      select: optionsDefault,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }
  return prisma.post.findMany({
    take: options.take,
    skip: 0,
    select: optionsDefault,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
};


export const countPosts = async () => {
  return prisma.post.count();
};

export const findPostsByUserId = async (userId: string) => {
  return prisma.post.findMany({
    where: {
      authorId: userId,
    },
    select: optionsDefault,
  });
};
