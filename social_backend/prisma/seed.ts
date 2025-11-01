import { PrismaClient, Prisma } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

const createUser = () => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: "",
    randomToken: faker.internet.jwt(),
  };
};

const users: Prisma.UserCreateInput[] = faker.helpers.multiple(createUser, {
  count: 5,
});

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("12345678", salt);

  for (const u of users) {
    u.passwordHash = password;
    await prisma.user.create({ data: u });
  }
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
