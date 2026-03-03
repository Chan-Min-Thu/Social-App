import { prisma } from "../lib/prisma";
import { FriendType, ToCoupleFriend } from "@/types/friend.type";

const optionProfile = {
  id: true,
  username: true,
  avatarUrl: true,
};

export const requestedFriend = (friendData: FriendType) => {
  return prisma.friend.create({
    data: { ...friendData, status: "pending" },
  });
};

export const alreadyRequestToBeFriend = ({
  userId,
  toBeFriendId,
}: ToCoupleFriend) => {
  return prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: toBeFriendId, addresseeId: userId },
        { requesterId: userId, addresseeId: toBeFriendId },
      ],
      status: "pending",
    },
  });
};

export const acceptedFriend = (id: string) => {
  return prisma.friend.update({
    where: { id },
    data: {
      status: "accepted",
    },
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
    where: { addresseeId, status: "accepted" },
  });
};

export const alreadyAcceptedFriend = ({
  userId,
  toBeFriendId,
}: ToCoupleFriend) => {
  return prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: toBeFriendId, addresseeId: userId },
        { requesterId: userId, addresseeId: toBeFriendId },
      ],
      status: "accepted",
    },
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
  friendId,
}: {
  userId: string;
  friendId: string;
}) => {
  return prisma.friend.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: friendId },
        { requesterId: friendId, addresseeId: userId },
      ],
      status: "accepted",
    },
  });
};

export const findFriendshipBlocked = ({userId,friendId}:{userId:string,friendId:string})=>{
  return prisma.friend.findFirst({
   where: {
      OR: [
        { requesterId: userId, addresseeId: friendId },
        { requesterId: friendId, addresseeId: userId },
      ],
      status: "blocked",
    },
  })
}

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

export const getFriendsAcceptedAndPending = (userId: string) => {
  return prisma.friend.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: {
      id: true,
      addresseeId: true,
      addressee: {
        select: optionProfile,
      },
      requesterId: true,
      requester: {
        select: optionProfile,
      },
    },
  });
};

export const getFriends = (userId: string) => {
  return prisma.friend.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
      status: "accepted",
    },
    select: {
      id: true,
      addresseeId: true,
      addressee: {
        select: { ...optionProfile },
      },
      requesterId: true,
      requester: {
        select: { ...optionProfile },
      },
    },
  });
};

export const getBlockUser = (userId: string) => {
  return prisma.friend.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
      status: "blocked",
    },
    select: {
      requester: {
        select: optionProfile,
      },
      addressee: {
        select: optionProfile,
      },
    },
  });
};

export const getAcceptedAndPendingFriends = (userId: string) => {
  return prisma.friend.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
  });
};

export const getRequestedFriends = (userId: string) => {
  return prisma.friend.findMany({
    where: { addresseeId: userId, status: "pending" },
    select: {
      id: true,
      addresseeId: true,
      requesterId: true,
      requester: {
        select: optionProfile,
      },
    },
  });
};

export const getOtherUser = (userId: string, excluedIds: string[]) => {
  if (!excluedIds.length) {
    return prisma.user.findMany({
      where: {
        AND: [{ id: { not: userId } }, { status: "ACTIVE" }],
      },
      take: 10,
      skip: 0,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } else {
    return prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { id: { notIn: Array.from(excluedIds) } },
          { status: "ACTIVE" },
        ],
      },
      take: 10,
      skip: 0,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
};

export const getSentFriends = (userId: string) => {
  return prisma.friend.findMany({
    where: { requesterId: userId, status: "pending" },
    select: {
      id: true,
      addresseeId: true,
      requesterId: true,
      addressee: {
        select: {
          id: true,
          avatarUrl: true,
          username: true,
        },
      },
    },
  });
};

export const deleteFriendship = (friendshipId: string) => {
  return prisma.friend.delete({ where: { id: friendshipId } });
};

export const profileWithFriend = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      friendsInitiated: true,
      friendsReceived: true,
    },
  });
};

export const findFriendsByUserId = (userId: string) => {
  return prisma.friend.findMany({
    where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
    select: {
      id: true,
      addresseeId: true,
      addressee: {
        select: optionProfile,
      },
      requesterId: true,
      requester: {
        select: optionProfile,
      },
    },
  });
};

export const findFriendshipWithThisId = (userId: string) => {
  return prisma.friend.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
      status: "accepted",
    },

    select: {
      requester: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      addressee: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};
