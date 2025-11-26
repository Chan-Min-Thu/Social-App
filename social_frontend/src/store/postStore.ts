import { create } from "zustand";

type PostType = {
  loading: boolean;
  error: Error | null;
  posts: PostType | [];
};

const initialState: PostType = {
  loading: true,
  error: null,
  posts: [],
};

type Action = {
  getPosts: () => void;
  setPost: (post: PostType) => void;
};
// const setPosts = create<Action & PostType>((set, get) => {
//   getPosts: () => get((state) => {
//     state.loading:
//   }),
// });
