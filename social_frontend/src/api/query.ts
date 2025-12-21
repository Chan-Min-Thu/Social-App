import { QueryClient } from "@tanstack/react-query";
import api, { authApi } from "../api";
import type { CreateReactionType, ReactionType } from "@/types/reaction.type";
import type { CommentType } from "@/types/comment.type";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 7 * 60 * 1000, // 7 minutes
      retry: 3,
    },
  },
});

export const fetchUser = () =>
  authApi.get("/auth-check").then((res) => res.data);

export const fetchPosts = (query: string) =>
  api.get(`/posts/cursor-pagination${query}`).then((res) => res.data);

export const fetchPostById = (param: string) =>
  api.get(`posts/${param}`).then((res) => res.data);

export const postQuery = (query: string) => ({
  queryKey: ["posts", query],
  queryFn: () => fetchPosts(query),
});
export const postByIdQuery = (param: string) => ({
  queryKey: ["posts", param],
  queryFn: () => fetchPostById(param),
});
export const fetchPostsInfinite = async ({ pageParam = null }) => {
  const pageParams = pageParam
    ? `skip=1&lastCursor=${pageParam}&take=10`
    : "take=10&skip=0";
  const res = await api.get(`posts/cursor-pagination?${pageParams}`);
  return res.data;
};
export const userQuery = () => ({
  queryKey: ["auth-check"],
  queryFn: fetchUser,
});
export const postInfiniteQuery = () => ({
  queryKey: ["posts", "infinite"],
  queryFn: fetchPostsInfinite,
  initialPageParam: null,
  getNextPageParam: (lastPage: any) => {
    return lastPage.newCursor ?? null;
  },
  maxPages: 5,
});

export const postById = () => ({});

export const createReaction = async ({ postId, type }: CreateReactionType) => {
  await api
    .post("/reactions", { postId, type })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error creating reaction:", err);
    });
};

export const deleteReaction = async (reaction: ReactionType) => {
  await api
    .patch(`/reactions/${reaction.id}`, { postId: reaction.postId, type: "" })
    .then((res) => res.data);
};

export const createComment = async (comment: CommentType) => {
  console.log(comment);
  await api.post(`comments`, comment).then((res: any) => res.data);
};
