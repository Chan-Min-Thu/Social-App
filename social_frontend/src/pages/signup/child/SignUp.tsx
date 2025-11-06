import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { emailSchema } from "../../../utils/schema/validationSchemas";

export default function SignUp() {
  const { handleSubmit } = useForm({ resolver: zodResolver(emailSchema) });
  const navigate = useNavigate();

  const onSubmitHandler = (data: any) => {
    console.log(data);
  };
  return (
    <div className="flex justify-center flex-col w-full gap-4 mb-5">
      <div className="text-center mx-auto flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">
          Welcome soial.App
        </h1>
        <p className="text-sm font-medium opacity-70 ">
          Sign up with your email
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="flex flex-col justify-center gap-2 mt-8">
          <label className="inputbox validator">
            <EnvelopeClosedIcon />
            <input
              type="email"
              placeholder="mail@site.com"
              className="focus:outline-none"
              required
            />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>
        </div>
        <button
          className="btn btn-primary w-full mt-5"
          type="submit"
          onClick={() => navigate("verify")}
        >
          Get Otp
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
