import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 w-96 shadow-sm mx-auto mt-28 flex gap-4 p-3 font-family">
      <div className="text-center mx-auto w-full flex gap-3 justify-center flex-col">
        <h1 className=" text-2xl text-base-content font-bold">Welcome back</h1>
        <p className="text-sm font-medium opacity-70 ">
          Sign in to your account to continue
        </p>
      </div>
      <div className="mx-auto w-80 flex gap-5 justify-center flex-col">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
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
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <label className="inputbox validator">
            <LockClosedIcon />
            <input
              className="focus:outline-none"
              type="password"
              required
              placeholder="Password"
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
        </div>
        <p className="validator-hint hidden">
          Must be more than 8 characters, including
          <br />
          At least one number <br />
          At least one lowercase letter <br />
          At least one uppercase letter
        </p>
        <Link to={""} className="flex justify-end ">
          <p className="text-info font-medium text-sm">Forgot Password?</p>
        </Link>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Log in
        </button>
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
