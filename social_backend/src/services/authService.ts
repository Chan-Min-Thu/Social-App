import { prisma } from "../lib/prisma";

export const getUserByEmail = (email: string) => {
  if (email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
};

export const getOtpByEmail = (email: string) => {
  return prisma.otp.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = (userData: any) => {
  return prisma.user.create({
    data: userData,
  });
};

export const createOtp = (otpData: any) => {
  return prisma.otp.create({
    data: otpData,
  });
};

export const updateUser = (id: string, userData: any) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const updateOtp = (id: string, otpData: any) => {
  return prisma.otp.update({
    where: {
      id,
    },
    data: otpData,
  });
};

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      randomToken: true,
    },
  });
};
