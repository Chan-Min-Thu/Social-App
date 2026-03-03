import { useActionData, useNavigation, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema } from "@/utils/schema/validationSchemas";
import Button from "@/components/Button";

export default function UserProfile() {
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(userProfileSchema) });
  const onSubmitHandler = (data: any) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("profileImage", data.profileImage);
    submit(formData, {
      method: "post",
      action: ".",
      encType: "multipart/form-data",
    });
  };
  return (
    <div className="flex justify-center flex-col w-full gap-4 mb-5">
      <div className="text-center mx-auto flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">
          Welcome soial.App
        </h1>
        <p className="text-sm font-medium opacity-70 ">
          Enter your name and profile image.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex gap-5 flex-col mt-5"
      >
        <label className="inputbox w-full flex validator">
          <input
            type="text"
            {...register("username", {
              required: "Username is essentially required.",
            })}
            placeholder="Current Password"
            className="focus:outline-none flex-1 pl-5"
          />
        </label>
        {errors.username && (
          <div className="text-error">
            {typeof errors.username.message === "string"
              ? errors.username.message
              : "Invalid input"}
          </div>
        )}
        <label className="inputbox flex w-full validator">
          <input
            type="file"
            {...register("profileImage", {
              required: "Avatar photo is required.",
            })}
            placeholder="Photo"
            className="focus:outline-none flex-1 pl-5"
          />
        </label>
        {errors.profileImage && (
          <div className="text-error">
            {typeof errors.profileImage.message === "string"
              ? errors.profileImage.message
              : "Invalid input"}
          </div>
        )}
        {errors && <div className="text-error">{errors.root?.message}</div>}
        {actionData && (
          <div className="text-error p-2 text-sm">{actionData?.message}</div>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-2"
          content={isSubmitting ? "Submitting..." : "Submit"}
        />
      </form>
    </div>
  );
}
