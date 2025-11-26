import type { FC } from "react";
import { useLoaderData } from "react-router";
import CreatePost from "./child/CreatePost";
import Post from "./child/Post";

const PostLayout: FC = () => {
  const { posts } = useLoaderData();
  return (
    <div className="w-full mb-10">
      <CreatePost />
      <Post posts={posts.data} />
    </div>
  );
};
export default PostLayout;
