import { authSchema } from "../../utils/schema/authSchma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeClosedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSubmit, useNavigation, useActionData } from "react-router";

export default function Login() {
  const [passHidden, setPassHidden] = useState(false);
  const submit = useSubmit();
  const navigate = useNavigation();

  const isSubmitting = navigate.state === "submitting";
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const actionData = useActionData();
  const onSubmithandler = (data: any) => {
    // console.log("data", data);
    submit(data, { method: "POST", action: "/login" });
  };
  console.log(errors.password);
  return (
    <div className="card bg-base-100 w-96 shadow-sm mx-auto mt-28 flex gap-4 p-3 font-family">
      <div className="text-center mx-auto w-full flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">Welcome back</h1>
        <p className="text-sm font-medium opacity-70 ">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mx-auto w-80 flex gap-5 justify-center flex-col">
        <form
          onSubmit={handleSubmit(onSubmithandler)}
          className="flex gap-5 flex-col"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <label className="inputbox validator">
              <div className="flex items-center gap-2">
                <EnvelopeClosedIcon />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="example@mail.com"
                  className="focus:outline-none"
                  required
                />
              </div>
            </label>
            {errors.email && (
              <div className="validator-hint hidden">
                {errors.email?.message}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between gap-2">
            <label>Password</label>
            <label className="inputbox validator">
              <div className="flex items-center gap-2">
                <LockClosedIcon />
                <input
                  className="focus:outline-none"
                  type={passHidden ? "text" : "password"}
                  placeholder="**********"
                  required
                  {...register("password")}
                  title="Must be 9"
                />
              </div>
              {passHidden ? (
                <EyeClosedIcon onClick={() => setPassHidden(false)} />
              ) : (
                <EyeOpenIcon onClick={() => setPassHidden(true)} />
              )}
            </label>
          </div>
          {errors?.password && (
            <p className="text-error text-sm">{errors?.password?.message}</p>
          )}
          <Link to={""} className="flex justify-end ">
            <p className="text-info font-medium text-sm">Forgot Password?</p>
          </Link>
          {actionData && (
            <div className="text-error">{actionData?.message}</div>
          )}

          {isSubmitting ? (
            <button className="btn">
              <span className="loading loading-spinner"></span>
              Submitting...
            </button>
          ) : (
            <button className="btn btn-primary " type="submit">
              Log in
            </button>
          )}
        </form>
        <div className="divider"></div>
        <div className="flex justify-center">
          <p className="text-sm font-medium ">
            Don't have an account?
            <Link to="/signup">
              <span className="text-info ml-0.5">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
