import type { FC } from "react";
import ProfileCircle from "./ProfileCircle";

type ProfileProps = {
  imageUrl: string;
  name?: string;
  status?: string;
};
const Profile: FC<ProfileProps> = ({ imageUrl, name, status }) => {
  return (
    <div className="flex">
      <ProfileCircle imageUrl={imageUrl} size={"size-10"} />
      <div>
        <div>{name}</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {status}
        </div>
      </div>
    </div>
  );
};

export default Profile;
