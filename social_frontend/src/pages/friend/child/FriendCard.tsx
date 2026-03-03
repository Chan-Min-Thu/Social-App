import { useRemoveFriendship } from "@/hooks/acceptRequestFriend";
import { useCreateBlockUser } from "@/hooks/createBlockUser";
import { getProfileImageUrl } from "@/utils/profileUrl";
import DropDown from "@/components/DropDown";
import Profile from "@/components/Profile";


const FriendCard = ({ friend }:any) => {
  const { profile } = friend;
  const { mutate: removeMutation } = useRemoveFriendship("accepted");
  const {mutate:createBlockUserMutation} = useCreateBlockUser({friendId:profile.id,status:"accepted"})
  const removeFriendshipfun = () => {
    removeMutation(profile.id);
  };
  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md m-2">
        <li className="list-row flex justify-between">
          <Profile
            imageUrl={getProfileImageUrl(profile.avatarUrl)}
            name={profile.username}
            status="You are friends."
          />
          <DropDown onRemoveFriend={removeFriendshipfun} onCreateBlockUser={createBlockUserMutation} id={friend.profile.id} />
        </li>
      </ul>
    </div>
  );
};

export default FriendCard;
