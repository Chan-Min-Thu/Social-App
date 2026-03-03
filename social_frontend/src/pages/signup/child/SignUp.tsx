import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { emailSchema } from "@/utils/schema/validationSchemas";
import Button from "@/components/Button";

export default function SignUp() {
  const submit = useSubmit();
  const {
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(emailSchema),
  });
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const onSubmitHandler = (data: any) => {
    submit(data, { method: "POST", action: "." });
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
        <div className="flex flex-col justify-center gap-2 mb-4 mt-8">
          <label className="inputbox flex-start validator">
            <div className="flex items-center gap-2">
              <EnvelopeClosedIcon />
              <input
                type="email"
                {...register("email")}
                placeholder="mail@site.com"
                className="focus:outline-none text-start"
                required
              />
            </div>
            <div className=" validator-hint hidden">Enter valid email.</div>
          </label>
        </div>
        {actionData && (
          <div className="text-error p-2 text-sm">{actionData?.message}</div>
        )}
        {isSubmitting ? (
          <Button className="btn btn-primary w-full" content="Submitting...">
            <span className="loading loading-spinner"></span>
          </Button>
        ) : (
          <Button
            className="btn btn-primary w-full "
            type="submit"
            content="Get OTP"
          />
        )}
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
