import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import FooterMenu from "../../components/FooterMenu";
import { userQuery } from "../../api/query";

export default function Applayout() {
  const { data, isLoading } = useQuery(userQuery());
  return (
    <div className=" w-full bg-base-300 min-h-screen font-family">
      <Navbar user={data} />
      <div className="md:w-[80vw] w-[95vw] mx-auto md:px-20 px-4 py-8">
        <Outlet />
      </div>
      <FooterMenu />
    </div>
  );
}
