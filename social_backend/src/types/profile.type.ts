import { $Enums } from "../../generated/prisma";

export interface ProfileType {
  id?: string;
  userId: string;
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  location: string;
  website: string;
  birthDate: Date;
  gender: $Enums.Gender;
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
  gender?: $Enums.Gender;
  createdAt?: Date;
  updatedAt?: Date;
}
