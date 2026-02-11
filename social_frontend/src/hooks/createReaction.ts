import type { CreateReactionType } from "@/types/reaction.type";
import { createReaction } from "./../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { PostType } from "@/types/post.type";

export const useCreateReaction = ({
  postId,
  type,
  queryKey,
}: CreateReactionType) => {
  console.log("queryKey", queryKey);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createReaction({ postId, type }),
    /*
    onMutate: () => {
      const queryKey = ["posts", "infinite"];
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return (
          oldData &&
          oldData?.pages[0].posts.data.map((post: PostType) => {
            if (post.id === postId) {
              console.log(post);
              return {
                ...post,
                reactions: [
                  ...(post.reactions || []),
                  { id: Math.random(), type: "LOVE", postId },
                ],
                comments: [...(post.comments || [])],
              };
            }
            return post;
          })
        );
      });
    },
    */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
};
