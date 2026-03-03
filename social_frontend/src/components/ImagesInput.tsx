import React, { useRef } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { createPostIcons } from "@/config/CreatePost";
import Button from "@/components/Button";

interface ImageInputProps {
  setImage: React.Dispatch<React.SetStateAction<ImageProps[]>>;
  handleOnChange?: (files: FileList | null) => void;
}

export interface ImageProps {
  id: number;
  file: File;
  url: string;
}

export default function ImagesInput({
  setImage,
  handleOnChange,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
          name="images"
          onChange={handleFileChange}
          type="file"
        />
      )}
      <Button
        className="btn btn-outline btn-xs"
        onClick={(event: any) => {
          event.preventDefault();
          if (inputRef && inputRef.current) {
            inputRef.current.click();
          }
        }}
        content={createPostIcons[0].name + "++"}
      >
        <ImageIcon className="text-primary" />
      </Button>
    </div>
  );
}
