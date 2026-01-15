import { queryClient } from "./../api/query";
import {
  acceptedFriend,
  removeFriendship,
  requestedFriend,
} from "../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcceptFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requesterId: string) => acceptedFriend(requesterId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "requested"] });
    },
  });
};

export const useRequestFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addresseeId: string) => requestedFriend(addresseeId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "sent"] });
    },
  });
};

export const useRemoveFriendship = (status: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => removeFriendship(friendId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", status] });
    },
  });
};

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addresseeId: string) => requestedFriend(addresseeId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "sent"] });
    },
  });
};
