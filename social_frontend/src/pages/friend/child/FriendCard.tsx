import DropDown from "../../../components/DropDown";
import Profile from "../../../components/Profile";

const FriendCard = ({ friend }: any) => {
  const user = localStorage.getItem("user");
  console.log(JSON.parse(user || "{}").state.user.id);
  const { profile } = friend;
  console.log("friend profile:", profile);

  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="list-row flex justify-between">
          <Profile
            imageUrl={profile?.avatarUrl}
            name={profile.username}
            status="You are friends."
          />
          <DropDown />
        </li>
      </ul>
    </div>
  );
};

export default FriendCard;
