import { NavLink } from "react-router";
import { GearIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function FooterMenu() {
  const [onMuserHover, setOnMouseHover] = useState(false);
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-16 flex items-end "
      onMouseEnter={() => {
        setOnMouseHover(false);
      }}
      onMouseLeave={() => {
        setOnMouseHover(true);
      }}
    >
      <div
        className={`dock ${onMuserHover ? "translate-y-full" : "translate-y-0"} transition delay-100 duration-100`}
      >
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
    </div>
  );
}
