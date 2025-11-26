import { NavLink } from "react-router";
import FriendHeader from "../../components/FriendHeader";
import FriendLayout from "./child/FriendLayout";

export default function Friend() {
  return (
    <div className="">
      <FriendHeader />
      <ul className="menu mt-4 menu-vertical w-full flex justify-between lg:menu-horizontal bg-base-200 rounded-box">
        <li>
          <NavLink
            className={({ isActive }: any) =>
              `${isActive ? "bg-success-content" : "bg-base-100"}`
            }
            to="."
            end
          >
            Friends
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }: any) =>
              `${isActive ? "bg-success-content" : "bg-base-100"}`
            }
            to="requests"
          >
            Requests
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }: any) =>
              `${isActive ? "bg-success-content" : "bg-base-100"}`
            }
            to="sent"
          >
            Sent
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }: any) =>
              `${isActive ? "bg-success-content" : "bg-base-100"}`
            }
            to="suggestions"
          >
            Suggestions
          </NavLink>
        </li>
      </ul>
      <FriendLayout />
    </div>
  );
}
