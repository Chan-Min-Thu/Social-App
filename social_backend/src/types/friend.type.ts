// status is a plain string in prisma schema (e.g., 'pending', 'accepted', 'blocked')

export interface FriendType {
  id?: string;
  requesterId: string;
  addresseeId: string;
  status?: string;
  createdAt?: Date;
}
