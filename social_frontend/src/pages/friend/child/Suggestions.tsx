import { useOutletContext } from "react-router";
import type { FriendType } from "@/types/friend.type";
import Button from "../../../components/Button";
import Profile from "../../../components/Profile";
import type { ContextType } from "./FriendLayout";

export default function Suggestions() {
  const { data } = useOutletContext<ContextType>();
  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          People You May Know.
        </li>
        <li className="list-row flex flex-col">
          {data?.length === 0 ? (
            <div>You don't have suggestions.</div>
          ) : (
            data?.map((data: FriendType) => (
              <div key={data.id}>
                <Profile imageUrl="" name="" status="Suggestions Friends." />
                <div className="flex gap-3">
                  <Button className="btn-error btn-sm" content={"Add Friend"} />
                </div>
              </div>
            ))
          )}
        </li>
      </ul>
    </div>
  );
}
