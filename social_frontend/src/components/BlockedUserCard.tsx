import type { FriendType } from "@/types/friend.type";
import { BlockedUserIcon } from "./icons/BlockedUserIcon";
import Profile from "./Profile";
import Button from "./Button";
import DialogBox from "./DialogBox";

const data = [
  {
    profile: {
      id: 1,
      username: "john_doe",
      avatarUrl: "/avatars/john_doe.png",
    },
  },
  {
    profile: {
      id: 2,
      username: "jane_smith",
      avatarUrl: "/avatars/jane_smith.png",
    },
  },
];
const BlockedUserCard = () => {
  return (
    <div className="card bg-base-100 w-full h-full p-5  shadow-sm mt-6 relative">
      <div className="flex gap-3 flex-row justify-start items-center">
        <div className=" bg-base-200 rounded-full size-14 flex justify-center text-success items-center">
          <BlockedUserIcon />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">Blocked Users</p>
          <span className="text-xs">1 user blocked.</span>
        </div>
      </div>
      <div className="w-full my-4">
        <ul className="list bg-base-100 rounded-box m-2">
          <li className="list-row flex flex-col">
            {data?.length === 0 ? (
              <div>You don't have blocked friends.</div>
            ) : (
              data?.map((data: any) => (
                <div key={data.profile.id}>
                  {/* <DialogBox
                    onClick={() => console.log(data.profile.id)}
                    title="Unblock User."
                  /> */}
                  <div
                    key={data.profile.id}
                    className="flex justify-between w-full"
                  >
                    <Profile
                      imageUrl={
                        "https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      name={data.profile.username.toUpperCase()}
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
              ))
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlockedUserCard;
