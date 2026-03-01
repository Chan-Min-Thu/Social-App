import type { UserType } from "@/types/user.type";
import { Link } from "react-router";

type FriendsCardProps = {
  friends: UserType[];
  isFriendProfile: boolean;
};
const FriendsCard = ({ friends, isFriendProfile }: FriendsCardProps) => {
  
  return (
    <div className="card bg-base-100 w-full h-full  shadow-sm relative">
      <div className="card-body flex items-start justify-between flex-row ">
        <h2 className="card-title pb-4">Friends</h2>
        {!isFriendProfile && (
          <Link to="/">
            <span className=" underline">See All</span>
          </Link>
        )}
      </div>
      <div className="w-full mx-auto flex items-cente px-8 pb-4">
        <div className="grid grid-cols-3 mx-auto justify-between w-full gap-8">
          {friends.map((fri) => (
            <div
              key={fri.id}
              className=" flex items-center justify-center flex-col gap-2"
            >
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={fri.avatarUrl} />
                </div>
              </div>
              <h1>{fri.username}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;
