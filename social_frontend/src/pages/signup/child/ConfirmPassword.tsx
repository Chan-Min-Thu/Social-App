import { useState } from "react";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { passwordSchema } from "@/utils/schema/validationSchemas";
import Button from "@/components/Button";

export default function ConfirmPassword() {
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData();

  const onSubmitHandler = (data: any) => {
    submit(data, { method: "post", action: "." });
  };
  return (
    <div className="flex justify-center flex-col w-full gap-4 mb-5">
      <div className="text-center mx-auto flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">
          Welcome soial.App
        </h1>
        <p className="text-sm font-medium opacity-70 ">
          Please type your password and you need to be the same password.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="flex flex-col justify-center gap-2 mt-8">
          <div className="flex gap-2 justify-center flex-col">
            <label className="inputbox w-fullflex validator">
              <LockClosedIcon />
              <input
                id="password"
                type={visible.password ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="Password"
                className="focus:outline-none flex-1"
              />
              <Button
                onClick={() =>
                  setVisible({ ...visible, password: !visible.password })
                }
                content=""
              >
                {visible.password ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </label>
            <label className="inputbox flex w-full validator">
              <LockClosedIcon />
              <input
                type={visible.confirm ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm password"
                className="focus:outline-none flex-1"
              />

              <Button
                content=""
                onClick={() =>
                  setVisible({ ...visible, confirm: !visible.confirm })
                }
              >
                {visible.confirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
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
            <Button content="Submitting..." className="btn">
              <span className="loading loading-spinner"></span>
            </Button>
          ) : (
            <Button
              content="  Confirm Password"
              className="btn btn-primary"
              type="submit"
            />
          )}
        </div>
      </form>
      <div className="divider"></div>
      <div className="flex justify-center">
        <p className="text-sm font-medium ">
          If you have an account?
          <Link to="/login">
            <span className="text-info ml-0.5">Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
