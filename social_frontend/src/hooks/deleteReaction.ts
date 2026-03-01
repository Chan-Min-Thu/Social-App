import type { RemoveReactionType, ReactionType } from "@/types/reaction.type";
import { deleteReaction } from "./../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveReaction = ({ queryKey }: RemoveReactionType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reaction: ReactionType) => deleteReaction(reaction),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
