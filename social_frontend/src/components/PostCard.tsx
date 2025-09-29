import {
  ChatBubbleIcon,
  HeartIcon,
  Share1Icon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }: any) {
  const createdAt = new Date(post.createdAt);
  const createdTime = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div className="card card-border bg-base-100 w-full p-6 my-4">
      <div className="flex flex-row gap-2">
        <div className="avatar ">
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
          </div>
        </div>
        <div className="ml-1">
          <h1 className="texts-xs font-bold">{post.author.name}</h1>
          <span className="text-xs font-extralight">
            {createdTime + " ago"}
          </span>
        </div>
      </div>
      <div className="my-4">
        <h2 className="card-title">{post.title}</h2>
        <p>{post.content}</p>
      </div>
      {post.imageUrls.map((image: string, index: number) => (
        <figure key={index}>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
      ))}
      <div className="divider"></div>
      <div className="flex justify-between">
        <button className="flex flex-row items-center gap-1">
          <HeartIcon />
          <span className="text-xs"> 5</span>
        </button>

        <button className="flex flex-row items-center gap-1">
          <ChatBubbleIcon />
          <span className="text-xs">Comment</span>
        </button>

        <button className="flex flex-row items-center gap-1">
          <Share1Icon />
          <span className="text-xs">Share</span>
        </button>
      </div>
    </div>
  );
}
