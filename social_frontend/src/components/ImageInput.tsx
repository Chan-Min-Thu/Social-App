import React, { useRef } from "react";
import { createPostIcons } from "../config/CreatePost";
import { ImageIcon } from "@radix-ui/react-icons";

interface ImageInputProps {
  setImage: React.Dispatch<React.SetStateAction<ImageProps[]>>;
  handleOnChange?: (files: FileList | null) => void;
}

export interface ImageProps {
  id: number;
  file: File;
  url: string;
}

export default function ImageInput({
  setImage,
  handleOnChange,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = () => {
    if (inputRef.current) {
      const files = inputRef.current.files || null;
      if (!files?.length) return;
      handleOnChange?.(files);
      const newImages: ImageProps[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const id = Math.random();
          const url = URL.createObjectURL(file);
          newImages.push({ id, file, url });
        }
      });

      setImage((prev) => [...prev, ...newImages]);
      (document.getElementById("my_modal_2") as HTMLDialogElement).showModal();
    }
  };

  return (
    <div>
      {createPostIcons[0].input && (
        <input
          className="hidden"
          ref={inputRef}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          type="file"
        />
      )}
      <button className="btn btn-outline btn-xs" onClick={handleInput}>
        <ImageIcon className="text-primary" /> {createPostIcons[0].name + "++"}
      </button>
    </div>
  );
}
