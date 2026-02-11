import { ImageIcon } from "@radix-ui/react-icons";

export const createPostIcons = [
  {
    name: "Image",
    icon: ImageIcon,
    input: true,
  },
];

export const profileButton = [
  {
    name: "",
    icon: ImageIcon,
    input: true,
  },
];

export const generatePosts = Array.from({ length: 10 }, (_, i) => ({
  id: `post_${i + 1}`,
  createdAt: new Date().toISOString(),
  title: `Post Title ${i + 1}`,
  content: `This is the content for post ${i + 1}`,
  imageUrls:
    i % 2 === 0
      ? [
          `https://example.com/image${i + 1}.jpg`,
          `https://example.com/image${i + 1}.jpg`,
          `https://example.com/image${i + 1}.jpg`,
        ]
      : [],
  author: {
    id: `user_${i + 1}`,
    name: `User ${i + 1}`,
    imageUrl: `https://example.com/user${i + 1}.jpg`,
  },
  comments: [
    {
      id: 1,
      content: `Comment on post ${i + 1}`,
      author: {
        id: `user_${i + 10}`,
        name: `Commenter ${i + 10}`,
        imageUrl: `https://example.com/user${i + 10}.jpg`,
      },
    },
    {
      id: 2,
      content: `Comment on post ${i + 1}`,
      author: {
        id: `user_${i + 10}`,
        name: `Commenter ${i + 10}`,
        imageUrl: `https://example.com/user${i + 10}.jpg`,
      },
    },
  ],
  reactions: [
    {
      type: "LOVE",
      author: {
        id: `user_${i + 20}`,
        name: `Reactor ${i + 20}`,
        imageUrl: `https://example.com/user${i + 20}.jpg`,
      },
    },
  ],
}));
