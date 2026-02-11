import { Link } from "react-router";
import ToggleMode from "./ToggleMode";
import { BellIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Drawer from "./Drawer";
import Button from "./Button";
import p1 from "../assets/no-profile.png";
import imageUrl from "../config/imageUrl";

interface NavbarProps {
  user?: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
}
export default function Navbar({ user }: NavbarProps) {
  const profileUrl = imageUrl + "/optimized/" + user?.avatarUrl;
  return (
    <div className="navbar bg-base-200 shadow-sm px-4 md:px-20 sticky top-0 z-50">
      <div className="flex-1 ml-2">
        <Link to={"/"} className=" text-xl">
          social.app
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <ToggleMode />
        <Button
          className="btn btn-square btn-outline md:flex hidden size-8 rounded-full"
          content=""
        >
          <BellIcon className="text-xl text-primary" />
        </Button>
        <input
          type="text"
          placeholder="Search post or people..."
          className="input md:block hidden focus:outline-none w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-8 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={user?.avatarUrl ? profileUrl : p1}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-2"
          >
            <li>
              <Link to="/profile" className="text-sm">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="text-sm">
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-sm btn-outline md:hidden flex"
            >
              <HamburgerMenuIcon />
            </label>
          </div>
          <Drawer />
        </div>
      </div>
    </div>
  );
}
