import { useEffect, useState, type FC } from "react";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  Share1Icon,
  HeartIcon,
} from "@radix-ui/react-icons";
import type { ImageType, PostType } from "../types/post.type";
import { formatDistanceToNow } from "date-fns";
import Comments from "./Comments";
import { useCreateReaction } from "../hooks/createReaction";
import { useRemoveReaction } from "../hooks/deleteReaction";
import Button from "./Button";
import imageUrl from "../config/imageUrl";
import { useLocation, useParams } from "react-router";
import ProfileCircle from "./ProfileCircle";

type PostCardType = {
  post: PostType;
};

const PostCard: FC<PostCardType> = ({ post }) => {
  const location = useLocation();
  const param = useParams();
  const friendId = param?.userId as string;

  const pathname = location.pathname;
  const user = JSON.parse(localStorage.getItem("user") as string);
  const userId = user.state.user?.id;
  const reaction =
    post &&
    user &&
    post.reactions &&
    post.reactions.find((react) => react?.userId === userId);

  const { mutate: creatingReaction } = useCreateReaction({
    postId: post!.id as string,
    type: "LOVE",
    queryKey:
      pathname.length > 10
        ? ["otherProfile", friendId]
        : pathname === "/profile"
          ? ["profile", "me"]
          : ["posts", "infinite"],
  });

  const { mutate: deletingReaction } = useRemoveReaction({
    queryKey:
       pathname.length > 10
        ? ["otherProfile", friendId]
        : pathname === "/profile"
          ? ["profile", "me"]
          : ["posts", "infinite"],
  });

  const [toShowComment, setToShowComment] = useState<boolean>(false);
  const [isHearted, setIsHearted] = useState<boolean>(false);
  const createdAt = new Date(post.updatedAt);
  const createdTime = formatDistanceToNow(createdAt, { addSuffix: true });
  const imageUrlPath =
    post.author &&
    (post?.author?.avatarUrl?.startsWith("https")
      ? post.author.avatarUrl
      : imageUrl + post.author.avatarUrl);

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
          <ProfileCircle imageUrl={imageUrlPath!} size={"size-10"} />
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
              <img src={imageUrl + img.imageUrl} alt="Shoes" className="w-96" />
            </figure>
          ))}
        </div>
      ) : null}
      {post.image && post.image.length > 0 && <div className="divider"></div>}

      <div className="flex justify-between w-full">
        {isHearted ? (
          <Button
            onClick={() => {
              deletingReaction({ ...reaction, postId: post!.id });
            }}
            className="flex flex-row items-center gap-1 text-success"
            content={post.reactions?.length ? "" + post.reactions?.length : "+"}
          >
            <HeartFilledIcon className="size-5" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              creatingReaction();
            }}
            className=" btn flex flex-row items-center gap-1 text-success"
            content={post.reactions?.length ? "" + post.reactions?.length : "+"}
          >
            <HeartIcon className=" size-5" />
          </Button>
        )}
        <Button
          className="flex flex-row items-center gap-1"
          onClick={() => showComments()}
          content={post.comments?.length ? "" + post.comments?.length : "+"}
        >
          <ChatBubbleIcon className="text-primary" />
        </Button>
        <Button className="btn flex-row items-center gap-1" content="Share">
          <Share1Icon className="text-primary" />
        </Button>
      </div>
      {toShowComment
        ? post?.comments && (
            <Comments comments={post.comments} postId={post.id as string} />
          )
        : null}
    </div>
  );
};
export default PostCard;
