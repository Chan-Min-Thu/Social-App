import { postSchema } from "../utils/schema/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmit } from "react-router";
import type { ImageProps } from "./ImagesInput";
import ImagesInput from "./ImagesInput";
import Button from "./Button";

type CreatePostProps = {
  image: ImageProps[] | [];
};
const CreatePost = ({ image }: CreatePostProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageProps[]>([]);
  useEffect(() => {
    setSelectedImage([...image]);
  }, [image]);
  const {
    handleSubmit,
    register,
    setValue,

    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
    },
  });
  const submit = useSubmit();

  const onSubmithandler = (data: any) => {
    // Build FormData including files stored in selectedImage state
    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("content", data.content || "");
    // append files (multiple) with the same field name 'images'
    selectedImage.forEach((img) => {
      formData.append("images", img.file);
    });

    submit(formData, {
      method: "post",
      action: ".",
      encType: "multipart/form-data",
    });
    reset();
    (document.getElementById("my_modal_2") as HTMLDialogElement).close();
  };
  return (
    <div>
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
            <p className="text-error text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="form-control mb-4">
          <textarea
            className="textarea md:w-[30vw] w-[80vw] rounded-lg focus:outline-none"
            placeholder="Type here your ideas..."
            {...register("content", { required: "Content is required" })}
          />
          {errors.content && (
            <p className="text-error text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
        <ImagesInput
          setImage={setSelectedImage}
          handleOnChange={(files: FileList | null) => setValue("images", files)}
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn mt-2"
          content={isSubmitting ? "Posting..." : "Post"}
        />
      </form>
    </div>
  );
};

export default CreatePost;
