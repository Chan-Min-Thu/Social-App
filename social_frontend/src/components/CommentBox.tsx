import type { CommentType } from "@/types/comment.type";
import { HeartIcon } from "@radix-ui/react-icons";
import { type FC } from "react";
import Button from "./Button";
import ProfileCircle from "./ProfileCircle";
import imageUrl from "../config/imageUrl";

type CommentBoxProps = {
  comment: CommentType;
  setReply: () => void;
};

const CommentBox: FC<CommentBoxProps> = ({ comment, setReply }) => {
  const profileUrl = comment.author && (comment.author.avatarUrl as string);
  const profilePath = profileUrl?.startsWith("https")
    ? profileUrl
    : imageUrl + "/optimized/" + profileUrl;
  return (
    <div className="flex gap-2 w-full flex-col">
      <div className="flex gap-2">
        <div>
          <ProfileCircle imageUrl={profilePath} size={"size-9"} />
        </div>
        <div className="flex flex-col gap-2 bg-base-200 w-full pt-2 px-4 pb-4 rounded-xl">
          {comment.author && (
            <h1 className="text-sm font-medium">{comment.author.username}</h1>
          )}
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
      <div className="ml-11">
        <Button className="mr-2 btn" content="">
          <HeartIcon className="text-primary" />
        </Button>

        <Button
          content="Reply"
          onClick={setReply}
          className="btn btn-primary"
        />
      </div>
    </div>
  );
};

export default CommentBox;
