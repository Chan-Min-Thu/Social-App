import { useOutletContext } from "react-router";
import {
  useAcceptFriend,
  useRemoveFriendship,
} from "../../../hooks/acceptRequestFriend";
import Button from "../../../components/Button";
import Profile from "../../../components/Profile";
import DialogBox from "../../../components/DialogBox";
import type { ContextType } from "./FriendLayout";
import type { FriendType } from "@/types/friend.type";

export default function Requests() {
  const { data } = useOutletContext<ContextType>();
  const mutation = useAcceptFriend();
  const { mutate: removeMutation } = useRemoveFriendship("requested");
  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md m-2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Friend Requests.
        </li>
        <li className="list-row flex flex-col">
          {data?.length === 0 ? (
            <div>No Friend Requests</div>
          ) : (
            data?.map((data: FriendType) => (
              <div>
                <DialogBox
                  onClick={() => removeMutation(data.profile.id)}
                  title="Remove friend"
                />
                <div
                  key={data.profile.id}
                  className="flex justify-between w-full"
                >
                  <Profile
                    imageUrl={data.profile.avatarUrl}
                    name={data.profile.username}
                    status="Request to you."
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      className=" btn-success btn-sm"
                      content="Confirm"
                      onClick={() => mutation.mutate(data.profile.id)}
                    />
                    <Button
                      type="button"
                      className="btn-error btn-sm"
                      content="Remove"
                      onClick={() => {
                        const modal = document.getElementById(
                          "my_modal_1",
                        ) as HTMLDialogElement | null;
                        modal?.showModal();
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </li>
      </ul>
    </div>
  );
}
