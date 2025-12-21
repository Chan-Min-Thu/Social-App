import { create } from "zustand";
import type { PostType } from "../types/post.type";

type PostStateType = {
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  posts: PostType | [];
};

const initialState: PostStateType = {
  isLoading: true,
  hasMore: true,
  error: null,
  posts: [],
};

type Action = {
  getPosts: () => void;
  setPost: (post: PostStateType) => void;
};

const setPosts = create<PostStateType & Action>((set) => ({
  ...initialState,
  getPosts: () => {
    set((state) => ({
      posts: state.posts,
      isLoading: false,
      error: null,
      hasMore: true,
    }));
  },
  setPost: (post: PostType) => {
    return set((state) => ({
      ...state,
      posts: post,
    }));
  },
}));

export default setPosts;
