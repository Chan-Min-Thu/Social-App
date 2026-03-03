import { useOutletContext } from "react-router";
import type { UserType } from "@/types/user.type";
import { useAddFriend } from "@/hooks/acceptRequestFriend";
import type { ContextType } from "@/pages/friend/child/FriendLayout";
import Button from "@/components/Button";
import Profile from "@/components/Profile";
import imageUrl from "@/config/imageUrl";

export default function Suggestions() {
  const { data } = useOutletContext<ContextType>();
  const { mutate } = useAddFriend();
  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md m-2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          People You May Know.
        </li>
        <li className="list-row flex flex-col">
          {data?.length === 0 ? (
            <div>You don't have suggestions.</div>
          ) : (
            data?.map((data: UserType) => (
              <div key={data.id} className="flex justify-between">
                <Profile
                  imageUrl={data.avatarUrl.startsWith("http") ? data.avatarUrl : (imageUrl + data.avatarUrl)}
                  name={data.username}
                  status="Suggestions Friends."
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    className="btn-error btn-sm"
                    content={"Add Friend"}
                    onClick={() => mutate(data.id)}
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
