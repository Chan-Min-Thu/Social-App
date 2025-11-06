import { useState } from "react";
import { ChatBubbleIcon, HeartIcon, Share1Icon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import Comments from "./Comments";

export default function PostCard({ post }) {
  const [toShowComment, setToShowComment] = useState<boolean>(false);
  const createdAt = new Date(post.createdAt);
  const createdTime = formatDistanceToNow(createdAt, { addSuffix: true });

  const showComments = () => {
    setToShowComment((prev) => !prev);
  };
  return (
    <div className="card card-border bg-base-100 w-full p-6 my-4 rel">
      <div className="flex flex-row gap-2">
        <div className="avatar ">
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
          </div>
        </div>
        <div className="ml-1">
          <h1 className="text-sm font-bold">{post.author.name}</h1>
          <span className="text-xs font-extralight">
            {createdTime + " ago"}
          </span>
        </div>
      </div>
      <div className="my-4">
        <h2 className="text-md">{post.title}</h2>
        <p className="text-sm">{post.content}</p>
      </div>
      <div className={`grid grid-cols-3 gap-1`}>
        {post.imageUrls.map((image: string, index: number) => (
          <figure key={index}>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
        ))}
      </div>
      {post.imageUrls.length > 0 && <div className="divider"></div>}
      <div className="flex justify-between w-full">
        <button className=" btn flex flex-row items-center gap-1">
          <HeartIcon className="text-primary" />
          <span className="text-xs"> 5</span>
        </button>
        <button
          className="btn flex flex-row items-center gap-1"
          onClick={() => showComments()}
        >
          <ChatBubbleIcon className="text-primary" />
          <span className="text-xs">Comment</span>
        </button>
        <button className="btn flex-row items-center gap-1">
          <Share1Icon className="text-primary" />
          <span className="text-xs">Share</span>
        </button>
      </div>
      {toShowComment && <Comments comments={post.comments} />}
    </div>
  );
}
