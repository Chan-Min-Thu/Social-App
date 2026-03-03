import { NavLink, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFriend } from "@/api/query";
import FriendLayout from "@/pages/friend/child/FriendLayout";
import FriendHeader from "@/components/FriendHeader";

type friendNav = {
  to: string;
  title: string;
};
const friendNavs: friendNav[] = [
  {
    to: ".",
    title: "Friends",
  },
  {
    to: "requested",
    title: "Requests",
  },
  {
    to: "sent",
    title: "Sent",
  },
  {
    to: "toadd",
    title: "Suggestions",
  },
];
export default function Friend() {
  const location = useLocation();
  const status = location.pathname.split("/")?.[2] ?? "accepted";
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", status],
    queryFn: () => fetchFriend(status),
  });
  return (
    <div className="">
      <FriendHeader />
      <ul className="menu mt-4 menu-vertical w-full flex justify-between lg:menu-horizontal bg-base-200 rounded-box">
        {friendNavs.map((navbar: friendNav, index: number) => (
          <li key={index}>
            <NavLink
              className={({ isActive }: any) =>
                `${isActive ? "bg-success" : "bg-base-100"}`
              }
              to={navbar.to}
              end
            >
              {navbar.title}
            </NavLink>
          </li>
        ))}
      </ul>
      {isLoading ? (
        <div className="flex w-full justify-center items-center  mt-20">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <FriendLayout friends={friends?.data} />
      )}
    </div>
  );
}
