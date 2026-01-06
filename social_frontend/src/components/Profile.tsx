import type { FC } from "react";

type ProfileProps = {
  imageUrl: string;
  name?: string;
  status?: string;
};
const Profile: FC<ProfileProps> = ({ imageUrl, name, status }) => {
  return (
    <div className="flex">
      <div className=" rounded-full mr-2">
        <img className="size-10 rounded-box" src={imageUrl ?? ""} />
      </div>
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
