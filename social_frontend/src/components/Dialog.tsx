import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../schemas/postSchema";
import { Cross1Icon } from "@radix-ui/react-icons";
import ImageInput, { type ImageProps } from "./ImageInput";

interface DialogProps {
  image: ImageProps[] | [];
}

const Dialog = ({ image }: DialogProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageProps[]>([]);
  useEffect(() => {
    setSelectedImage([...image]);
  }, [image]);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(postSchema) });
  const onSubmithandler = (data: any) => {
    console.log(data);
    (document.getElementById("my_modal_2") as HTMLDialogElement).close();
  };
  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box flex w-[90vw] justify-center gap-4 flex-col items-center relative">
        <button
          className="btn btn-square rounded-full absolute top-2 right-4"
          onClick={() =>
            (document.getElementById("my_modal_2") as HTMLDialogElement).close()
          }
        >
          <Cross1Icon className="font-bold text-4xl" />
        </button>

        <h1 className="text-xl font-bold">Create Post</h1>

        <div className="modal-action">
          <form
            onSubmit={handleSubmit(onSubmithandler)}
            className="flex w-full gap-2 flex-col"
            method="dialog"
          >
            <div className="form-control mb-4">
              <input
                type="text"
                className="input md:w-[30vw] w-[80vw] focus:outline-none "
                placeholder="Title..."
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="form-control mb-4">
              <textarea
                className="textarea md:w-[30vw] w-[80vw] rounded-lg focus:outline-none"
                placeholder="Type here your ideas..."
                {...register("content", { required: "Content is required" })}
              />
              {errors.content && (
                <p className="text-error text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
            <ImageInput
              setImage={setSelectedImage}
              handleOnChange={(files: FileList | null) =>
                setValue("images", files)
              }
            />
            <div className="flex flex-row">
              {selectedImage.length
                ? selectedImage.map((image) => (
                    <div key={image.id} className="w-20 max-h-32 m-2">
                      <img
                        src={image.url}
                        alt="post_img"
                        className="w-20  h-auto"
                      />
                    </div>
                  ))
                : ""}
            </div>

            <button type="submit" className="btn mt-2">
              Post
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
