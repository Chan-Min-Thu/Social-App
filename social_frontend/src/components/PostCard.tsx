import { useEffect, useState, type FC } from "react";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  Share1Icon,
  HeartIcon,
} from "@radix-ui/react-icons";
import type { ImageType, PostType } from "../types/post.type";
import { formatDistanceToNow } from "date-fns";
// import { reactionFun } from "../utils/function/reaction";
import Comments from "./Comments";
// import type { ReactionType } from "@/types/reaction.type";
import { useCreateReaction } from "../hooks/createReaction";
import { useRemoveReaction } from "../hooks/deleteReaction";

type PostCardType = {
  post: PostType;
};

const imageUrl = import.meta.env.VITE_IMAGE_API_URL;
const PostCard: FC<PostCardType> = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const userId = user.state.user.id;
  const reaction =
    post &&
    user &&
    post.reactions &&
    post.reactions.find((react) => react?.userId === userId);
  const { mutate: creatingReaction } = useCreateReaction({
    postId: post!.id,
    type: "LOVE",
  });

  const { mutate: deletingReaction } = useRemoveReaction({
    ...reaction,
    postId: post.id,
  });

  const [toShowComment, setToShowComment] = useState<boolean>(false);
  const [isHearted, setIsHearted] = useState<boolean>(false);
  const createdAt = new Date(post.updatedAt);
  const createdTime = formatDistanceToNow(createdAt, { addSuffix: true });
  const showComments = () => {
    setToShowComment((prev) => !prev);
  };
  useEffect(() => {
    if (reaction) {
      setIsHearted(true);
    } else {
      setIsHearted(false);
    }
  }, [reaction]);
  return (
    <div className="card card-border bg-base-100 w-full p-6 my-4 rel relative">
      <div className="flex flex-row gap-2">
        <div className="flex flex-row">
          <div className="avatar ">
            <div className="w-12 rounded-full">
              {post.author && <img src={post.author.avatarUrl} />}
            </div>
          </div>
          <div className="ml-1">
            <h1 className="text-sm font-bold">{post.author?.username}</h1>
            <span className="text-xs font-extralight">
              {createdTime + " ago"}
            </span>{" "}
          </div>
        </div>
        <div></div>
      </div>
      <div className="my-4 ml-8 flex flex-col gap-3">
        <h2 className="text-xl font-medium">{post.title}</h2>
        <p className="text-sm font-light italic">{post.content}</p>
      </div>
      {post.image && post.image ? (
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
      ) : null}
      {post.image && post.image.length > 0 && <div className="divider"></div>}

      <div className="flex justify-between w-full">
        {isHearted ? (
          <button
            onClick={() => {
              console.log("removing reaction");
              deletingReaction({ ...reaction, postId: post!.id });
            }}
            className=" btn flex flex-row items-center gap-1 text-success"
          >
            <HeartFilledIcon className="size-5" />
            <span className="text-xs">
              {post.reactions?.length ? post.reactions?.length : "+"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              creatingReaction();
            }}
            className=" btn flex flex-row items-center gap-1 text-success"
          >
            <HeartIcon className=" size-5" />

            <span className="text-xs">
              {post.reactions?.length ? post.reactions?.length : "+"}
            </span>
          </button>
        )}
        <button
          className="btn flex flex-row items-center gap-1"
          onClick={() => showComments()}
        >
          <ChatBubbleIcon className="text-primary" />
          <span className="text-xs">Comment</span>
          <span className="text-xs">
            {post.comments?.length ? post.comments?.length : "+"}
          </span>
        </button>
        <button className="btn flex-row items-center gap-1">
          <Share1Icon className="text-primary" />
          <span className="text-xs">Share</span>
        </button>
      </div>
      {toShowComment
        ? post.comments && (
            <Comments comments={post.comments} postId={post.id} />
          )
        : null}
    </div>
  );
};
export default PostCard;
