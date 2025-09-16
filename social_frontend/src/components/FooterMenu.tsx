import { GearIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";


export default function FooterMenu() {
  return (
    <div className="dock">
      <button>
        <HomeIcon className="text-primary"/>
        <span className="dock-label">Home</span>
      </button>

      <button className="dock-active">
        <PersonIcon className="text-primary"/>
        <span className="dock-label">Friends</span>
      </button>

      <button>
        <GearIcon className="text-primary"/>
        <span className="dock-label">Settings</span>
      </button>
    </div>
  );
}
