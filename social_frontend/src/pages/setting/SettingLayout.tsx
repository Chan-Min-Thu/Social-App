import { Outlet } from "react-router";
import SettingCard from "../../components/SettingCard";

export default function SettingLayout() {
  return (
    <div className="md:w-[80vw] w-[95vw] mx-auto md:px-20 px-4 py-8">
      <Outlet />
    </div>
  );
}
