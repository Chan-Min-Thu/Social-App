import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import FooterMenu from "../../components/FooterMenu";

export default function Applayout() {
  return (
    <div className=" w-full bg-base-300 h-screen font-family">
      <Navbar />
      <div className="w-full px-20">
        <Outlet />
      </div>
      <FooterMenu />
    </div>
  );
}
