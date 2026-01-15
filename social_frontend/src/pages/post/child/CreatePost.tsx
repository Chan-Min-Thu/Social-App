import { useState } from "react";
import Dialog from "../../../components/Dialog";
import ImageInput, { type ImageProps } from "../../../components/ImageInput";
import type { UserType } from "@/types/user.type";

type CreatePostProps = {
  user: UserType;
};
export default function CreatePost({ user }: CreatePostProps) {
  const [image, setImage] = useState<ImageProps[]>([]);

  const handleOpenDialog = () => {
    (
      document.getElementById("my_modal_2") as HTMLDialogElement | null
    )?.showModal();
    setImage([]);
  };

  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <div className="card-body">
        <div className=" flex items-center gap-4 justify-between w-full">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
              <img src={user.avatarUrl} />
            </div>
          </div>
          <div className="w-full">
            <button
              className="btn btn-ghost w-full justify-start text-sm font-medium"
              onClick={handleOpenDialog}
            >
              What's on your mind?
            </button>
          </div>
        </div>
        <div className="card-actions md:px-14 px-2 justify-between items-center mt-2">
          <div>
            <ImageInput setImage={setImage} />
          </div>

          <Dialog image={image} />
          <div>
            <button className="btn btn-primary btn-sm"> Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
