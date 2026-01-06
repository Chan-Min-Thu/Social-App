import { createComment, queryClient } from "../api/query";
import type { CommentType } from "../types/comment.type";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import CommentBox from "./CommentBox";
import CommentForm from "./CommentForm";

type CommentPropType = {
  comments: CommentType[];
  postId: string;
};
export default function Comments({ comments, postId }: CommentPropType) {
  const parentComment = comments.filter(
    (cm: CommentType) => cm.parentId === null
  );
  const childComment = comments.reduce<Record<string, CommentType[]>>(
    (acc, comment) => {
      if (comment.parentId) {
        acc[comment.parentId] = acc[comment.parentId] || [];
        acc[comment.parentId].push(comment);
      }
      return acc;
    },
    {}
  );
  const [replybox, setReplybox] = useState<string | null>(null);
  const { mutate } = useMutation({
    mutationFn: (data: CommentType) => createComment(data),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["posts", "infinite"],
      }),
  });
  const onSubmitHandler = (data: CommentType) => {
    mutate({ content: data.content, postId });
  };
  const onSubmitReplyHandler = (data: CommentType) => {
    mutate({ content: data.content, parentId: String(replybox), postId });
    setReplybox(null);
  };
  return (
    <div className="flex gap-3 flex-col my-2 card">
      <div
        className={` ${
          comments.length && "absolute z-20"
        } w-full flex flex-col gap-2 px-4 pb-4 bg-transprent`}
      >
        <div className="flex justify-between px-2">
          <h1 className="text-xl font-bold">Comments</h1>
        </div>
        <CommentForm onSubmitHandler={onSubmitHandler} />
      </div>
      {parentComment.length > 0 && (
        <div className="card-body px-4 bg-base-100 mt-32 h-44 overflow-y-scroll">
          <div className="flex gap-2 flex-col">
            {parentComment.map((com: CommentType, index: number) => (
              <div key={index} className="flex gap-1 w-full flex-col">
                <CommentBox
                  comment={com}
                  setReply={() =>
                    setReplybox((prev) =>
                      prev !== null ? null : String(com.id)
                    )
                  }
                />
                {replybox && (
                  <CommentForm onSubmitHandler={onSubmitReplyHandler} />
                )}
                {childComment[String(com.id)]?.map((child) => (
                  <div key={child.id} className="ml-12 mt-2">
                    <CommentBox
                      comment={child}
                      setReply={() =>
                        setReplybox((prev) =>
                          prev !== null ? null : String(com.id)
                        )
                      }
                    />
                    {replybox && (
                      <CommentForm onSubmitHandler={onSubmitReplyHandler} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
