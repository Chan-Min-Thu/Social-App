import { useOutletContext } from "react-router";
import type { ContextType } from "@/pages/friend/child/FriendLayout";
import FriendCard from "@/pages/friend/child/FriendCard";

export default function Friends() {
  const { data } = useOutletContext<ContextType>();

  return (
    <div className="w-full">
      <div className="w-full my-4">
        <input
          type="text"
          placeholder="Search post or people..."
          className="input md:block hidden focus:outline-none w-full"
        />
      </div>
      <div>
        {data?.length ? (
          data?.map((data: any) => (
            <div key={data.id}>
              <FriendCard friend={data satisfies ContextType} />
            </div>
          ))
        ) : (
          <div>No Friends Found</div>
        )}
      </div>
    </div>
  );
}
