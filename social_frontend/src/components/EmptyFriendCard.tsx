import { useNavigate } from "react-router";
import Button from "@/components/Button";
import { GroupPersonIcon } from "@/components/icons/GroupPersonIcon";

const EmptyFriendCard = () => {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 h-auto w-full shadow-sm">
      <div className="card-body flex gap-4 items-start ">
        <h2 className="card-title ">Friends</h2>
        <div className="text-center w-56 h-52 flex justify-center items-center gap-3 flex-col mx-auto my-5">
          <GroupPersonIcon />

          <p>
            You haven't added any friend yet. Please related with others to
            comminicate. Add your bio, website, and other details to let others
            know more about you.
          </p>
          <Button
            content="Find Friends"
            className="btn-primary"
            onClick={() => navigate("/friends")}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyFriendCard;
