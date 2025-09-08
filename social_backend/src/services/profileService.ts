import { prisma } from "../config/prisma";

export const createProfile = (profileData: any) => {
  return prisma.profile.create({
    data: profileData,
  });
};

export const updateProfile = (profileData: any) => {
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
  });
};

export const findProfileById = (id: string) => {
  return prisma.profile.findUnique({
    where: { id },
  });
};
