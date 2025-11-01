import { prisma } from "../config/prisma";
import { FriendType } from "../types/friend.type";

export const requestedFriend = (friendData: FriendType) => {
  return prisma.friend.create({
    data: { ...friendData, status: "pending" },
  });
};
export const updatedFriend = (friendData: { id: string; status: string }) => {
  return prisma.friend.update({
    where: { id: friendData.id },
    data: { status: friendData.status },
  });
};

export const isFriend = (friendId: string) => {
  return prisma.friend.findFirst({
    where: { id: friendId },
  });
};
export const getFriendRequest = (addresseeId: string) => {
  return prisma.friend.findMany({
    where: { addresseeId },
  });
};

export const createBlockUser = (blockData: {
  blockerId: string;
  blockedId: string;
}) => {
  return prisma.blockUser.create({
    data: { ...blockData },
  });
};
export const deleteBlockUser = (blockId: string) => {
  return prisma.blockUser.delete({ where: { id: blockId } });
};
export const findBlockRow = ({
  blockedId,
  blockerId,
}: {
  blockerId: string;
  blockedId: string;
}) => {
  return prisma.blockUser.findFirst({
    where: { blockerId, blockedId },
  });
};

export const findFriendship = ({
  userId,
  blockedId,
}: {
  userId: string;
  blockedId: string;
}) => {
  return prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: blockedId },
        { requesterId: blockedId, addresseeId: userId },
      ],
    },
  });
};
export const blockYourAccount = ({ userId, friendId }: any) => {
  return prisma.blockUser.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: friendId },
        { blockerId: friendId, blockedId: userId },
      ],
    },
  });
};
