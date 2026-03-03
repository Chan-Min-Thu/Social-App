import { type FC } from "react";
import type { PostType } from "@/types/post.type";
import PostCard from "@/components/PostCard";

type PostPropsType = {
  posts: PostType[];
};

const Post: FC<PostPropsType> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <div className="w-full text-center">No posts available.</div>;
  }
  return (
    <div className=" w-full">
      {posts.map((post: PostType) => (
        <div key={post.id} className="mb-5">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};
export default Post;
