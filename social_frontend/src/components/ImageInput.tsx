import React, { useRef } from "react";
import { createPostIcons } from "../config/CreatePost";
import { CameraIcon } from "@radix-ui/react-icons";
import Button from "./Button";
import {
  useUploadProfileImage,
  useUploadCoverImage,
} from "../hooks/uploadImage";

type ImageInputProps = {
  type: "profile" | "cover";
};
export interface ImageProps {}

export default function ImageInput({ type }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutationProfile = useUploadProfileImage();
  const mutationCover = useUploadCoverImage();

  const handleInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] || null;
      if (!file) return;
      if (type === "cover") {
        mutationCover.mutate(file);
        return;
      }
      mutationProfile.mutate(file);
    }
  };

  return (
    <div>
      {createPostIcons[0].input && (
        <input
          className="hidden"
          ref={inputRef}
          accept="image/*"
          name="images"
          onChange={handleFileChange}
          type="file"
        />
      )}
      <Button
        className="btn btn-base-200 btn-xs size-9 btn-circle "
        content=""
        onClick={handleInput}
      >
        <CameraIcon className="text-sm text-success" />
      </Button>
    </div>
  );
}
