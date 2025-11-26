import type { FC } from "react";
import type { PostType } from "../../../types/post.type";
import PostCard from "../../../components/PostCard";

type PostPropsType = {
  posts: PostType[];
};

const Post: FC<PostPropsType> = ({ posts }) => {
  return (
    <div className=" w-full">
      {posts.map((post: any) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};
export default Post;
