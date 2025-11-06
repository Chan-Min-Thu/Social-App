import { Link, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OtpInput from "react-otp-input";
import { otpSchema } from "../../../utils/schema/validationSchemas";

export default function VerifyOtp() {
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(otpSchema),
  });
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    console.log("hello", data);
    navigate("/signup/confirmPassword");
  };

  return (
    <div className="flex justify-center flex-col w-full gap-4 mb-5">
      <div className="text-center mx-auto flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">
          Welcome soial.App
        </h1>
        <p className="text-sm font-medium opacity-70 ">
          Verify your otp and it will expire within 2 mins.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center gap-2 mt-8">
          <div className="flex gap-2 justify-center">
            <Controller
              name={"otp"}
              control={control}
              render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className=" border-base-300 rounded-sm input-info focus:outline-none"
                    />
                  )}
                />
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full mt-5"
          // onClick={() => navigate("/signup/confirmPassword")}
        >
          Verify Otp
        </button>
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
