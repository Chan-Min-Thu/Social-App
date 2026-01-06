import type { CommentType } from "@/types/comment.type";
import { commentSchema } from "../utils/schema/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";

type CommentFormPorps = {
  onSubmitHandler: (data: CommentType) => void;
};
const CommentForm: FC<CommentFormPorps> = ({ onSubmitHandler }) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });
  const onSubmitHandlerAndSetValue = (data: any) => {
    onSubmitHandler(data);
    setValue("content", "");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandlerAndSetValue)}
      className="ml-10 my-2"
    >
      <div className="flex flex-row gap-2 bg-base-200 w-full px-4 py-4 rounded-xl">
        <input
          type="text"
          {...register("content", { required: "Comment is required." })}
          className="input focus:outline-none flex-1"
          placeholder="Please write your comments."
        />
        <button type="submit" className="btn">
          Create
        </button>
      </div>
      {errors.content && (
        <p className="text-error text-sm mt-1">{errors.content.message}</p>
      )}
    </form>
  );
};

export default CommentForm;
