import { $Enums } from "../../generated/prisma";

export interface FriendType {
  id?: string;
  requesterId: string;
  addresseeId: string;
  status?: $Enums.Status;
  createdAt?: Date;
}
