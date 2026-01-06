import type { UserType } from "./user.type";

export type FriendType = {
  id: string;
  addresseeId: string;
  profile: UserType;
  requesterId: string;
};
