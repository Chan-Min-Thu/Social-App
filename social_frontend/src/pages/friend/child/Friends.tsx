import { useOutletContext } from "react-router";
import FriendCard from "./FriendCard";
import type { ContextType } from "./FriendLayout";

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
