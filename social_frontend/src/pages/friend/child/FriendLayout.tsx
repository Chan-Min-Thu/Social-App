import type { UserType } from "@/types/user.type";
import { Outlet } from "react-router";

export type ContextType = { data: UserType[] | null };

export default function FriendLayout({
  friends,
}: {
  friends: UserType[] | null;
}) {
  const contextValue: ContextType = { data: friends };
  return (
    <div className="w-full flex">
      <Outlet context={contextValue} />
    </div>
  );
}
