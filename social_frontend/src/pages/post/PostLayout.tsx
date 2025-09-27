import CreatePost from "./child/CreatePost";
import Post from "./child/Post";

export default function PostLayout() {
  return (
    <div className="w-full mb-10">
      <CreatePost />
      <Post/>
    </div>
  );
}
