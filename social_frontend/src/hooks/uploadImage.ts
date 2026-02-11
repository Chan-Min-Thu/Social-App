import { uploadCoverImage, uploadProfileImage } from "../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: any) => uploadProfileImage(file),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUploadCoverImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: any) => uploadCoverImage(file),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
