// status is a plain string in prisma schema (e.g., 'pending', 'accepted', 'blocked')

import { UserType } from "./user.type";

export interface FriendType {
  id?: string;
  requesterId: string;
  addresseeId: string;
  addressee?: any;
  requester?: any;
  status?: string;
  createdAt?: Date;
}

export type ProfileType = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type ToCoupleFriend = {
  userId: string;
  toBeFriendId: string;
};
