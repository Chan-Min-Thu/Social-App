import { useOutletContext } from "react-router";
import { useRemoveFriendship } from "@/hooks/acceptRequestFriend";
import { getProfileImageUrl } from "@/utils/profileUrl";
import type { ContextType } from "@/pages/friend/child/FriendLayout";
import Button from "@/components/Button";
import DialogBox from "@/components/DialogBox";
import Profile from "@/components/Profile";
import type {SentFriendType} from "@/types/user.type"


export default function Sent() {
  const { data } = useOutletContext<ContextType>();
  const sentData = data as SentFriendType[] | null;
  const { mutate: removeMutation } = useRemoveFriendship("sent");

  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md m-2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Sent Requests.
        </li>
        <li className="list-row flex flex-col">
          {sentData?.length === 0 ? (
            <div>No Friends Sent.</div>
          ) : (
            sentData?.map((data: SentFriendType) => (
              <div key={data.profile.id}>
                <DialogBox
                  onClick={() => removeMutation(data.profile.id)}
                  title="Cancle request-friend"
                />
                <div
                  key={data.profile.id}
                  className="flex justify-between w-full gap-3"
                >
                  <Profile
                    imageUrl={getProfileImageUrl(data.profile.avatarUrl)}
                    name={data.profile.username}
                    status="You sent as a friend."
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      className="btn-error btn-sm"
                      content={"Cancle"}
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
