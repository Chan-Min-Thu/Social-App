import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { updatePassword } from "@/api/query";
import { updatePasswordSchema } from "@/utils/schema/validationSchemas";
import { LockIcon } from "@/components/icons/LockIcon";
import Button from "@/components/Button";
import type { UpdatePasswordType } from "@/types/updatePassword.type";

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState({
    oldPassword: false,
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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdatePasswordType) => updatePassword(data),
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, { position: "bottom-center" });
    },
    onSuccess: () => {
      toast.success("Password updated successfully!", { position: "bottom-center" });
      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate(data);
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
            type={visible.oldPassword ? "text" : "password"}
            {...register("oldPassword", {
              required: "Current Password is required.",
            })}
            placeholder="Current Password"
            className="focus:outline-none flex-1 pl-5"
          />

          <Button
            onClick={() =>
              setVisible({
                ...visible,
                oldPassword: !visible.oldPassword,
              })
            }
            content=""
          >
            {visible.oldPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Button>
        </label>
        {errors.oldPassword && (
          <div className="text-error">{errors.oldPassword.message}</div>
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
          <div className="text-error">{errors.newPassword.message}</div>
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
          <div className="text-error">{errors.newConfirmPassword.message}</div>
        ) : null}
        {errors && <div className="text-error">{errors.root?.message}</div>}
        <Button
          type="submit"
          disabled={isPending}
          className="btn btn-primary mt-2"
          content={isPending ? "Updating Password..." : "Update Password"}
        />
      </form>
    </div>
  );
};

export default ChangePasswordForm;
