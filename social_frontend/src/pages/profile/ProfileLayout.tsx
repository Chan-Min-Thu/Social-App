import { Outlet } from "react-router";

const ProfileLayout = () => {
  return (
    <div className="w-full h-auto mb-10">
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
