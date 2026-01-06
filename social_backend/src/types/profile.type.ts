import type { Gender as PrismaGender } from "../../generated/prisma/enums";

export interface ProfileType {
  id?: string;
  userId: string;
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  location: string;
  website: string;
  birthDate: Date;
  gender: PrismaGender;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdatedProfileType {
  id?: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  birthDate?: Date;
  gender?: PrismaGender;
  createdAt?: Date;
  updatedAt?: Date;
}
