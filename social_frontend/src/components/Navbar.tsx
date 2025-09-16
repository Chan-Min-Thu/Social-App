import { Link } from "react-router";
import ToggleMode from "./ToggleMode";
import { BellIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  return (
    <div className="navbar bg-base-200 shadow-sm px-20">
      <div className="flex-1">
        <Link to={"/"} className=" text-xl">social.app</Link>
      </div>
      <div className="flex gap-4">
        <ToggleMode/>
        <button className="btn btn-square btn-outline rounded-full"><BellIcon className="text-primary"/></button>
        <input
          type="text"
          placeholder="Search"
          className="input focus:outline-none w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
