import type { Post } from "@/types/post.type";
import PostCard from "../../../components/PostCard";
import { generatePosts } from "../../../config/CreatePost";

export default function Post() {
  return (
    <div className=" w-full">
      {generatePosts.map((post: any) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
