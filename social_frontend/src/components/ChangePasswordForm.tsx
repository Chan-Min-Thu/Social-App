import { useState } from "react";
import { LockIcon } from "./icons/LockIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "react-router";
import { updatePasswordSchema } from "../utils/schema/validationSchemas";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Button from "./Button";
import { useUpdatePassword } from "../hooks/updatePassword";

const ChangePasswordForm = () => {
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    newConfirmPassword: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });

  const { mutate } = useUpdatePassword();

  // const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";


  const onSubmitHandler = (data: any) => {
    mutate(data)
  };
  return (
    <div className="card bg-base-100 w-full h-full p-5  shadow-sm mt-6 relative">
      <div className="flex gap-3 flex-row justify-start items-center">
        <div className=" bg-base-200 rounded-full size-14 flex justify-center text-success items-center">
          <LockIcon />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">Change Password</p>
          <span className="text-xs">Update your account password.</span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex gap-5 flex-col mt-5"
      >
        <label className="inputbox w-full flex validator">
          <input
            type={visible.currentPassword ? "text" : "password"}
            {...register("currentPassword", {
              required: "Current Password is required.",
            })}
            placeholder="Current Password"
            className="focus:outline-none flex-1 pl-5"
          />

          <Button
            onClick={() =>
              setVisible({
                ...visible,
                currentPassword: !visible.currentPassword,
              })
            }
            content=""
          >
            {visible.currentPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Button>
        </label>
        {errors.currentPassword && (
          <div className="text-error">
            {errors.currentPassword.message}
          </div>
        )}
        <label className="inputbox flex w-full validator">
          <input
            type={visible.newPassword ? "text" : "password"}
            {...register("newPassword", {
              required: "Confirm Password is required.",
            })}
            placeholder="New Password"
            className="focus:outline-none flex-1 pl-5"
          />

          <Button
            content=""
            onClick={() =>
              setVisible({
                ...visible,
                newPassword: !visible.newPassword,
              })
            }
            className=""
          >
            {visible.newPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Button>
        </label>
        {errors.newPassword && (
          <div className="text-error">
            {errors.newPassword.message}
          </div>
        )}
        <label className="inputbox flex w-full validator">
          <input
            type={visible.newConfirmPassword ? "text" : "password"}
            {...register("newConfirmPassword", {
              required: "New confirm Password is required.",
            })}
            placeholder="New Confrim Password"
            className="focus:outline-none flex-1 pl-5"
          />
          <Button
            content=""
            onClick={() =>
              setVisible({
                ...visible,
                newConfirmPassword: !visible.newConfirmPassword,
              })
            }
          >
            {visible.newConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Button>
        </label>
        {errors.newConfirmPassword ? (
          <div className="text-error">
            {errors.newConfirmPassword.message}
          </div>
        ) : null}
       {errors && <div className="text-error">{errors.root?.message}</div>}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-2"
          content={isSubmitting ? "Updating Password..." : "Update Password"}
        />
      </form>
    </div>
  );
};

export default ChangePasswordForm;
