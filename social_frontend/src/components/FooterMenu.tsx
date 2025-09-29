import { NavLink } from "react-router";
import { GearIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";

export default function FooterMenu() {
  return (
    <div className="dock">
      <NavLink
        to={"/"}
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? "dock-active" : ""
        }
      >
        <HomeIcon className="text-primary" />
        <span className="dock-label">Home</span>
      </NavLink>

      <NavLink
        to={"/friends"}
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? "dock-active" : ""
        }
      >
        <PersonIcon className="text-primary" />
        <span className="dock-label">Friends</span>
      </NavLink>

      <NavLink
        to={"/settings"}
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? "dock-active" : ""
        }
      >
        <GearIcon className="text-primary" />
        <span className="dock-label">Settings</span>
      </NavLink>
    </div>
  );
}
