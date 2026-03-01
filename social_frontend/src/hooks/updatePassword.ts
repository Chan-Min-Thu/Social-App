import { updatePassword } from "../api/query";
import type { UpdatePasswordType } from "../types/updatePassword.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:UpdatePasswordType) => updatePassword(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};