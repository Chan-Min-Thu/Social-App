import { useNavigate } from "react-router";
import Button from "./Button";
import { BlockedUserIcon } from "./icons/BlockedUserIcon";
import { ChevronIcon } from "./icons/ChevronIcon";
import { HelpIcon } from "./icons/HelpIcon";
import { LockIcon } from "./icons/LockIcon";
import { PrivacyIcon } from "./icons/PrivacyIcon";

const settingNavs = [
  {
    id: 1,
    content: "Change Password",
    icon: <LockIcon />,
    href: "change-password",
  },
  {
    id: 2,
    content: "Blocked User",
    icon: <BlockedUserIcon />,
    href: "blocked-user",
  },
  {
    id: 3,
    content: "Privacy & Security",
    icon: <PrivacyIcon />,
    href: "blocked-user",
  },
  {
    id: 4,
    content: "Help & Support",
    icon: <HelpIcon />,
    href: "blocked-user",
  },
];

const SettingNavCard = () => {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 w-full h-full  shadow-sm relative">
      <ul className="menu bg-base-200 rounded-box w-full gap-5">
        {settingNavs.map((nav) => (
          <li key={nav.id}>
            <Button
              className="btn"
              content=""
              onClick={() => navigate(nav.href)}
            >
              <div className="flex justify-between items-center w-full">
                <span className="flex text-center items-center justify-center font-medium gap-6">
                  {nav.icon}
                  <span className="text-lg font-medium">{nav.content}</span>
                </span>
                <span className=" text-center">
                  <ChevronIcon />
                </span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingNavCard;
