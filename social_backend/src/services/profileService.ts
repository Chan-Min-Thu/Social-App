import { prisma } from "../lib/prisma";
import { ProfileType, UpdatedProfileType } from "../types/profile.type";

export const createProfile = (profileData: ProfileType) => {
  return prisma.profile.create({
    data: profileData,
  });
};

export const updateProfile = (profileData: UpdatedProfileType) => {
  return prisma.profile.update({
    where: {
      id: profileData.id,
    },
    data: profileData,
  });
};

export const findProfileByUserId = (userId: string) => {
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
          friendsInitiated: {
            select: {
              addressee: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              status: true,
            },
          },
          friendsReceived: {
            select: {
              requester: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              status: true,
            },
          },
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

export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateProfileImage = ({
  id,
  avatarUrl,
}: {
  id: string;
  avatarUrl: string;
}) => {
  return prisma.user.update({ where: { id }, data: { avatarUrl } });
};
