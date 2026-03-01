import type { CreateBlockType } from "@/types/user.type";
import { createBlockUser } from "./../api/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { PostType } from "@/types/post.type";

export const useCreateBlockUser = ({
  friendId,status}:CreateBlockType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createBlockUser(friendId),
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
      queryClient.invalidateQueries({ queryKey: ["friends",status] });
    },
  });
};
