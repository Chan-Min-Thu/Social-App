import { useUnblockUser } from "@/hooks/unblockFriend";
import Profile from "@/components/Profile";
import Button from "@/components/Button";
import DialogBox from "@/components/DialogBox";
import { getProfileImageUrl } from "@/utils/profileUrl";
import type { UserType } from "@/types/user.type";
import { BlockedUserIcon } from "./icons/BlockedUserIcon";

type BlockedUserCardProps = {
  data: UserType[];
};

const BlockedUserCard = ({ data }: BlockedUserCardProps) => {
  const { mutate } = useUnblockUser();
  return (
    <div className="card bg-base-100 w-full h-full p-5  shadow-sm mt-6 relative">
      <div className="flex gap-3 flex-row justify-start items-center">
        <div className=" bg-base-200 rounded-full size-14 flex justify-center text-success items-center">
          <BlockedUserIcon />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">Blocked Users</p>
          <span className="text-xs">
            {data.length ? `${data.length} users blocked.` : ` 0 user blocked.`}
          </span>
        </div>
      </div>

      <div className="w-full my-4">
        <ul className="list bg-base-100 rounded-box m-2">
          <li className="list-row flex flex-col">
            {data.length ?
              data?.map((data: UserType) => (
                <div key={data.id}>
                  <DialogBox
                    onClick={()=>mutate(data.id)}
                    title={"Unblock user"}
                  />
                  <div className="flex justify-between w-full">
                    <Profile
                      imageUrl={getProfileImageUrl(data.avatarUrl)}
                      name={data.username.toUpperCase()}
                      status="You blocked this user."
                    />
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        className="btn-primary btn-sm"
                        content={"Unblock"}
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
              )):<p className=" text-xl font-medium text-center">No blocked users.</p>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlockedUserCard;
