import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { fetchBlockedFriends } from "@/api/query";
import BlockedUserCard from "@/components/BlockedUserCard";

const BlockUsers = () => {
  const { data: blockedUsers } = useQuery({
    queryKey: ["blocked-friends"],
    queryFn: fetchBlockedFriends,
  });
  console.log(blockedUsers);
  return (
    <div className="">
      <Link
        to="/settings"
        className="flex gap-2 flex-row items-center hover:bg-success w-fit p-1 rounded-xl"
      >
        <ChevronLeftIcon />
        <span className="text-xl font-black mr-1.5">Back to Settings</span>
      </Link>
      <div className="flex w-full">
        {blockedUsers ? (
          <BlockedUserCard data={blockedUsers.data} />
        ) : (
          <div>You don't have blocked friends.</div>
        )}
      </div>
    </div>
  );
};

export default BlockUsers;
