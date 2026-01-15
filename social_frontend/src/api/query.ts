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

export const fetchPostById = async (param: string) =>
  await api.get(`posts/${param}`).then((res) => res.data);

export const fetchFriend = async (param: string) =>
  await api.get(`friends/${param}`).then((res) => res.data);

export const acceptedFriend = async (requesterId: string) =>
  await api.post(`friend-accept`, { requesterId }).then((res) => res.data);

export const requestedFriend = async (addresseeId: string) =>
  await api.post(`friend-request`, { addresseeId }).then((res) => res.data);

export const removeFriendship = async (removeFriendshipId: string) =>
  await api
    .delete("friend-remove", { data: { removeFriendshipId } })
    .then((res) => res.data);

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

export const createReaction = async ({ postId, type }: CreateReactionType) => {
  await api
    .post("/reactions", { postId, type })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error creating reaction:", err);
    });
};

export const createComment = async (comment: CommentType) => {
  await api.post(`comments`, comment).then((res: any) => res.data);
};

export const deleteReaction = async (reaction: ReactionType) => {
  await api
    .patch(`/reactions/${reaction.id}`, { postId: reaction.postId, type: "" })
    .then((res) => res.data);
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

export const friendQuery = (param: string) => {
  return {
    queryKey: ["friends", param],
    queryFn: fetchFriend(param),
  };
};
