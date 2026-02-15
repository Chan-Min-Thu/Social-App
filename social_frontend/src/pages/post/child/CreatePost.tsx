import { useState } from "react";
import Dialog from "../../../components/Dialog";
import ImagesInput, { type ImageProps } from "../../../components/ImagesInput";
import type { UserType } from "@/types/user.type";
import Button from "../../../components/Button";
import imageUrl from "../../../config/imageUrl";
import ProfileCircle from "../../../components/ProfileCircle";

type CreatePostProps = {
  user: UserType;
};
export default function CreatePost({ user }: CreatePostProps) {
  const [image, setImage] = useState<ImageProps[]>([]);
  const profileUrl = user.avatarUrl.startsWith("https")
    ? user.avatarUrl
    : imageUrl + "/optimized/" + user.avatarUrl;
  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <div className="card-body">
        <div className=" flex items-center gap-4 justify-between w-full">
          {/* <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
              <img src={} />
            </div>
          </div> */}
          <ProfileCircle
            imageUrl={profileUrl}
            size="size-8 ring-primary ring-offset-base-100 ring-2 ring-offset-2"
          />
          <div className="w-full">
            <Button
              className="btn btn-ghost w-full justify-start text-sm font-medium"
              onClick={() => {
                (
                  document.getElementById(
                    "my_modal_2",
                  ) as HTMLDialogElement | null
                )?.showModal();
                setImage([]);
              }}
              content="What's on your mind?"
            />
          </div>
        </div>
        <div className="card-actions md:px-14 px-2 justify-between items-center mt-2">
          <div>
            <ImagesInput setImage={setImage} />
          </div>

          <Dialog image={image} type="Create Post" />
          <div>
            <Button content="Post" className="btn btn-primary btn-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
