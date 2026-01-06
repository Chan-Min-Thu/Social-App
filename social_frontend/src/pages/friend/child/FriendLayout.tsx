import type { FriendType } from "@/types/friend.type";
import { Outlet } from "react-router";

export type ContextType = { data: FriendType[] | null };

export default function FriendLayout({
  friends,
}: {
  friends: FriendType[] | null;
}) {
  const contextValue: ContextType = { data: friends };
  return (
    <div className="w-full flex">
      <Outlet context={contextValue} />
    </div>
  );
}
