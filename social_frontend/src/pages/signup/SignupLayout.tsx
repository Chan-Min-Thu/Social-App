import { Outlet } from "react-router";

export default function SignupLayout() {
  return (
    <div className="card bg-base-100 w-96 shadow-sm mx-auto mt-28 flex gap-4 p-3 font-family">
      <Outlet />
    </div>
  );
}
