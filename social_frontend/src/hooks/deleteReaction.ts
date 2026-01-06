import type { ReactionType } from "@/types/reaction.type";
import { deleteReaction } from "./../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveReaction = (reaction: ReactionType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteReaction(reaction),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
    },
  });
};
