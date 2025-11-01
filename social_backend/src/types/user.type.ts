import { $Enums } from "../../generated/prisma";

export interface UserType {
  id?: string;
  username?: string;
  email: string;
  passwordHash: string;
  randomToken: string;
  status: $Enums.Status;
  createdAt: Date;
  lastLogin: Date | null;
  errorCount: number;
  updatedAt: Date;
}
