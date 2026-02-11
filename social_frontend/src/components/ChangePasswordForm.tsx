import { useState } from "react";
import { LockIcon } from "./icons/LockIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionData, useNavigation, useSubmit } from "react-router";
import { updatePasswordSchema } from "../utils/schema/validationSchemas";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import Button from "./Button";

const ChangePasswordForm = () => {
  const [visible, setVisible] = useState({
    currentPassword: false,
    confirmPassword: false,
    newPassword: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const onSubmitHandler = (data: any) => {
    // submit(data, { method: "post", action: "." });
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
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {" "}
        <div className="flex flex-col justify-center gap-2 mt-8">
          <div className="flex gap-5 justify-center flex-col">
            <label className="inputbox w-full flex validator">
              <input
                id="password"
                type={visible.currentPassword ? "text" : "password"}
                {...register("currentPassword", { required: true })}
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
            <label className="inputbox flex w-full validator">
              <input
                type={visible.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm password"
                className="focus:outline-none flex-1 pl-5"
              />

              <Button
                content=""
                onClick={() =>
                  setVisible({
                    ...visible,
                    confirmPassword: !visible.confirmPassword,
                  })
                }
                className=""
              >
                {visible.confirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </label>
            <label className="inputbox flex w-full validator">
              <input
                type={visible.confirmPassword ? "text" : "password"}
                id="newPassword"
                {...register("newPassword", { required: true })}
                placeholder="New password"
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
              >
                {visible.newPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </label>
            {errors.confirmPassword ? (
              <div className="validator-hint hidden">
                {errors.confirmPassword.message}
              </div>
            ) : null}
          </div>
          {actionData && <p className="text-error">{actionData.message}</p>}
          {isSubmitting ? (
            <Button content="Submitting..." className="btn ">
              <span className="loading loading-spinner"></span>
            </Button>
          ) : (
            <Button
              content="  Confirm Password"
              className="btn btn-primary mt-5"
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
