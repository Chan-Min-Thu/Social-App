/*
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../utils/schema/postSchema";
import ImagesInput,
import { useSubmit } from "react-router";
*/
import { type ImageProps } from "./ImagesInput";
import { Cross1Icon } from "@radix-ui/react-icons";
import Button from "./Button";
import CreatePost from "./CreatePost";
import CreateProfile from "./CreateProfile";
import UpdateProfile from "./UpdateProfile";
import type { UserInfoType } from "@/types/user.type";

interface DialogProps {
  image?: ImageProps[] | [];
  type: string;
  data?: UserInfoType;
  profileId?: string;
}

const Dialog = ({ image, type, data, profileId }: DialogProps) => {
  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box flex w-[90vw] justify-center gap-4 flex-col items-center relative">
        <Button
          className=" btn-square rounded-full absolute top-2 right-4"
          onClick={() =>
            (document.getElementById("my_modal_2") as HTMLDialogElement).close()
          }
          content=""
        >
          <Cross1Icon className="font-bold text-4xl" />
        </Button>

        <h1 className="text-xl font-bold">{type}</h1>

        <div className="modal-action">
          {type === "Create Post" ? (
            <CreatePost image={image ?? []} />
          ) : type === "Create Profile" ? (
            <CreateProfile />
          ) : (
            <UpdateProfile data={data} profileId={profileId} />
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
