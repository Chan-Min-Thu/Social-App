import { prisma } from "../lib/prisma";
import { ProfileType, UpdatedProfileType } from "../types/profile.type";

export const createProfile = (profileData: ProfileType) => {
  return prisma.profile.create({
    data: profileData,
  });
};

export const updateProfile = (profileData: UpdatedProfileType) => {
  console.log("to update profile", profileData);
  return prisma.profile.update({
    where: {
      id: profileData.id,
    },
    data: profileData,
  });
};

/*
 id               String      @id @default(uuid())
  username         String? // kyaw1 // aung2
  email            String      @unique @db.VarChar(41)
  avatarUrl        String?
  passwordHash     String
  randomToken      String
  status           Status      @default(ACTIVE)
  lastLogin        DateTime?
  errorCount       Int         @default(0) @db.SmallInt
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  posts            Post[]
  comments         Comment[]
  reactions        Reaction[]
  stories          Story[]
  sentMessages     Message[]   @relation("SentMessages")
  receivedMessages Message[]   @relation("ReceivedMessages")
  followedBy       User[]      @relation("UserFollows")
  following        User[]      @relation("UserFollows")
  friendsInitiated Friend[]    @relation("FriendsInitiated")
  friendsReceived  Friend[]    @relation("FriendsReceived")
  blockerIds       BlockUser[] @relation("BlockerIds") // This user blocks other users 
  blockedIds       BlockUser[] @relation("BlockedIds") // This user is blocked by other users 
  Profile          Profile?
  */

export const findProfileByUserId = (userId: string) => {
  console.log("Find profile by user id:", userId);
  return prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
      bio: true,
      location: true,
      website: true,
      birthDate: true,
      gender: true,
      // avatarUrl: true,
      coverUrl: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};

export const findProfileById = (id: string) => {
  return prisma.profile.findUnique({
    where: { id },
  });
};
