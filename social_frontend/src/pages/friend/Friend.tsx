import { NavLink } from "react-router";
import FriendHeader from "../../components/FriendHeader";
import FriendLayout from "./child/FriendLayout";

type friendNav = {
  to: string;
  title: string;
};
const friendNavs: friendNav[] = [
  {
    to: ".",
    title: "Friends",
  },
  {
    to: "requests",
    title: "Requests",
  },
  {
    to: "sent",
    title: "Sent",
  },
  {
    to: "suggestions",
    title: "Suggestions",
  },
];
export default function Friend() {
  return (
    <div className="">
      <FriendHeader />
      <ul className="menu mt-4 menu-vertical w-full flex justify-between lg:menu-horizontal bg-base-200 rounded-box">
        {friendNavs.map((navbar: friendNav) => (
          <li>
            <NavLink
              className={({ isActive }: any) =>
                `${isActive ? "bg-success" : "bg-base-100"}`
              }
              to={navbar.to}
              end
            >
              {navbar.title}
            </NavLink>
          </li>
        ))}
      </ul>
      <FriendLayout />
    </div>
  );
}
