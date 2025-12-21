import type { Status as PrismaStatus } from "../../generated/prisma/enums";

export interface UserType {
  id?: string;
  username?: string;
  email: string;
  avatarUrl?: string | null;
  passwordHash: string;
  randomToken: string;
  status?: PrismaStatus;
  createdAt: Date;
  lastLogin?: Date | null;
  errorCount: number;
  updatedAt: Date;
}
