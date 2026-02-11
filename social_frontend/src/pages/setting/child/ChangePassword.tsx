import { Link } from "react-router";
import { ChevronLeftIcon } from "../../../components/icons/ChevronLeftIcon";
import ChangePasswordForm from "../../../components/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <div className="w-full">
      <Link
        to="/settings"
        className="flex gap-2 flex-row items-center hover:bg-success w-fit p-1 rounded-xl"
      >
        <ChevronLeftIcon />
        <span className="text-xl font-black mr-1.5">Back to Settings</span>
      </Link>
      <div className="flex w-full">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePassword;
