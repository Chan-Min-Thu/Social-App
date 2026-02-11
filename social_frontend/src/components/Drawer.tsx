import { BellIcon } from "@radix-ui/react-icons";
import Button from "./Button";

export default function Drawer() {
  return (
    <div className="drawer-side md:hidden ">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="menu bg-base-200 md:hidden flex gap-4 text-base-content min-h-full w-80 p-4">
        <label>
          <input
            type="text"
            placeholder="Search your posts."
            className="input focus:outline-none w-full md:w-auto"
          />
        </label>
        <Button
          className="flex gap-2 btn btn-ghost justify-start"
          content="Notifications"
        >
          <BellIcon />
        </Button>
      </div>
    </div>
  );
}
