import {
  type UpdateProfileParams,
  type UserInfoType,
} from "./../types/user.type";
import { createProfile, updateProfile } from "../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userInfo: UserInfoType) => createProfile(userInfo),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, userInfo }: UpdateProfileParams) =>
      updateProfile({ profileId, userInfo }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
