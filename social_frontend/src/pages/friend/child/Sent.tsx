import { useOutletContext } from "react-router";
import Button from "../../../components/Button";
import Profile from "../../../components/Profile";
import type { ContextType } from "./FriendLayout";
import type { FriendType } from "@/types/friend.type";
import { useRemoveFriendship } from "../../../hooks/acceptRequestFriend";

export default function Sent() {
  const { data } = useOutletContext<ContextType>();
  const { mutate: removeMutation } = useRemoveFriendship("sent");
  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md m-2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Sent Requests.
        </li>
        <li className="list-row flex flex-col">
          {data?.length === 0 ? (
            <div>No Friends Sent.</div>
          ) : (
            data?.map((data: FriendType) => (
              <div key={data.id} className="flex justify-between w-full">
                <Profile
                  imageUrl={data.profile.avatarUrl}
                  name={data.profile.username}
                  status="You sent as a friend."
                />
                <div className="flex gap-3">
                  <Button
                    className="btn-error btn-sm"
                    content={"Cancle"}
                    onClick={() => removeMutation(data.addresseeId)}
                  />
                </div>
              </div>
            ))
          )}
        </li>
      </ul>
    </div>
  );
}
