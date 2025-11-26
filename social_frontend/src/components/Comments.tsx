import type { comment } from "@/types/comment.type";
import { HeartIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type CommentPropType = {
  comments: comment[];
};
export default function Comments({ comments }: CommentPropType) {
  console.log(comments);
  const [replybox, setReplybox] = useState<number | null>(null);
  //   const openModal = () => {};
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
        <div className="flex flex-row gap-2 bg-base-200 w-full px-4 py-4 rounded-xl">
          <input
            className="input focus:outline-none flex-1"
            placeholder="Please write your comments."
          />
          <button className="btn">Post</button>
        </div>
      </div>
      {comments.length > 0 && (
        <div className="card-body p-0 bg-base-100 mt-32 h-44 overflow-y-scroll">
          <div className="flex gap-2 flex-col">
            {comments.map((com: any, index: number) => (
              <div key={index} className="flex gap-2 w-full flex-col">
                <div className="flex gap-2">
                  <div>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-base-200 w-full pt-2 px-4 pb-4 rounded-xl">
                    <h1 className="text-sm font-medium">cmt</h1>
                    <p className="text-sm">{com.content}</p>
                  </div>
                </div>
                <div className="ml-11">
                  <button className="mr-2 btn">
                    <HeartIcon className="text-primary" />
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      setReplybox((prev) => (prev === com.id ? null : com.id))
                    }
                  >
                    Reply
                  </button>
                </div>
                {replybox === com.id && (
                  <div className="ml-9 ">
                    <div className="flex gap-2">
                      <div>
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 bg-base-200 w-full px-4 py-4 rounded-xl">
                        <input
                          className="input focus:outline-none flex-1"
                          placeholder="Please write your comments."
                        />
                        <button className="btn">Post</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* <div>
          <div className="flex gap-2 w-full flex-col">
            <div className="flex gap-2">
              <div>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 bg-base-200 w-full px-4 py-4 rounded-xl">
                <input
                  className="input focus:outline-none flex-1"
                  placeholder="Please write your comments."
                />
                <button className="btn">Post</button>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      )}
    </div>
  );
}
