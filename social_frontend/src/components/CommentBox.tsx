import type { CommentType } from "@/types/comment.type";
import { HeartIcon } from "@radix-ui/react-icons";
import { type FC } from "react";

type CommentBoxProps = {
  comment: CommentType;
  setReply: () => void;
};

const CommentBox: FC<CommentBoxProps> = ({ comment, setReply }) => {
  return (
    <div className="flex gap-2 w-full flex-col">
      <div className="flex gap-2">
        <div>
          <div className="avatar">
            <div className="w-8 rounded-full">
              {comment.author && (
                <img src={comment?.author?.avatarUrl} alt="comment-photo" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-base-200 w-full pt-2 px-4 pb-4 rounded-xl">
          {comment.author && (
            <h1 className="text-sm font-medium">{comment.author.username}</h1>
          )}
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
      <div className="ml-11">
        <button className="mr-2 btn">
          <HeartIcon className="text-primary" />
        </button>
        <button className="btn" onClick={setReply}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
