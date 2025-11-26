import { useState, type FC } from "react";
import { ChatBubbleIcon, Share1Icon } from "@radix-ui/react-icons";
import type { ImageType, PostType } from "../types/post.type";
import { formatDistanceToNow } from "date-fns";
// import { reactionFun } from "../utils/function/reaction";
import { Angry, Heart, Laugh, Plus, ThumbsUp } from "lucide-react";
import Comments from "./Comments";

type PostCardType = {
  post: PostType;
};

const imageUrl = import.meta.env.VITE_IMAGE_API_URL;
const PostCard: FC<PostCardType> = ({ post }) => {
  const [toShowComment, setToShowComment] = useState<boolean>(false);
  const createdAt = new Date(post.updatedAt);
  const createdTime = formatDistanceToNow(createdAt, { addSuffix: true });

  const showComments = () => {
    setToShowComment((prev) => !prev);
  };
  return (
    <div className="card card-border bg-base-100 w-full p-6 my-4 rel relative">
      <div className="flex flex-row gap-2">
        <div className="flex flex-row">
          <div className="avatar ">
            <div className="w-12 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
            </div>
          </div>
          <div className="ml-1">
            <h1 className="text-sm font-bold">{post.author?.username}</h1>
            <span className="text-xs font-extralight">
              {createdTime + " ago"}
            </span>
          </div>
        </div>
        <div></div>
      </div>
      <div className="my-4 ml-8 flex flex-col gap-3">
        <h2 className="text-xl font-medium">{post.title}</h2>
        <p className="text-sm font-light italic">{post.content}</p>
      </div>
      <div className={`grid grid-cols-${post.image.length} gap-1`}>
        {post.image?.map((img: ImageType) => (
          <figure key={img.id}>
            <img
              src={imageUrl + "/optimized/" + img.imageUrl}
              alt="Shoes"
              className="w-96"
            />
          </figure>
        ))}
      </div>
      {post.image.length > 0 && <div className="divider"></div>}
      <div className="flex justify-between w-full">
        <button className=" btn flex flex-row items-center gap-1 text-success">
          {post.reactions?.map((react): any => {
            switch (react.type) {
              case "LIKE": {
                return <ThumbsUp />;
              }
              case "LOVE": {
                return <Heart />;
              }
              case "ANGRY": {
                return <Angry />;
              }
              case "HAHA":
                return <Laugh />;
              default:
                return <ThumbsUp />;
            }
          })}

          <div className="text-xs">
            {post.reactions?.length === 0 ? (
              <div className="flex flex-row text-success">
                {" "}
                <ThumbsUp className=" size-3" />
                <Heart className=" size-3" />
                <Laugh className="size-3" />
              </div>
            ) : (
              post.reactions?.length
            )}
          </div>
        </button>
        <button
          className="btn flex flex-row items-center gap-1"
          onClick={() => showComments()}
        >
          <ChatBubbleIcon className="text-primary" />
          <span className="text-xs">Comment</span>
          <span className="text-xs">
            {post.comments?.length === 0 ? "+" : post.comments?.length}
          </span>
        </button>
        <button className="btn flex-row items-center gap-1">
          <Share1Icon className="text-primary" />
          <span className="text-xs">Share</span>
        </button>
      </div>
      {toShowComment
        ? post.comments && <Comments comments={post.comments} />
        : null}
    </div>
  );
};
export default PostCard;
