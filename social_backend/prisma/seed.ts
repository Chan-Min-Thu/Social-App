import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Post,Status,User } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const createUser = (): Prisma.UserCreateInput => {
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    passwordHash: "",
    randomToken: faker.internet.jwt(),
    avatarUrl: faker.image.avatar(),
    status: "ACTIVE" as Status,
  };
};

const createPost = (users: User[]): Prisma.PostCreateManyInput => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return {
    content: faker.lorem.paragraph(),
    authorId: users[randomIndex].id,
    title: faker.lorem.sentence(),
  };
};

const createComment = (users: User[], posts: Post[]) => {
  const randomIndexUser = Math.floor(Math.random() * users.length);
  const randomIndexPost = Math.floor(Math.random() * posts.length);
  return {
    content: faker.lorem.sentence(),
    authorId: users[randomIndexUser].id,
    postId: posts[randomIndexPost].id,
  };
};

const users: Prisma.UserCreateInput[] = faker.helpers.multiple(createUser, {
  count: 30,
});

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("1111111111", salt);
  for (const u of users) {
    u.passwordHash = password;
    (await prisma.user.create({ data: u })) as User;
  }
  let createdUsers = await prisma.user.findMany();
  await prisma.post.createMany({
    data: faker.helpers.multiple(() => createPost(createdUsers), {
      count: 80,
    }),
  });
  let createdPosts = (await prisma.post.findMany()) as Post[];
  await prisma.comment.createMany({
    data: faker.helpers.multiple(
      () => createComment(createdUsers, createdPosts),
      {
        count: 80,
      }
    ),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
