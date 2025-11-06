import { Outlet } from "react-router";

export default function FriendLayout() {
  return (
    <div className="w-full flex">
      <Outlet />
    </div>
  );
}
