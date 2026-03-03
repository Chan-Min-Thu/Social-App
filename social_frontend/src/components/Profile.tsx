import type { FC } from "react";
import ProfileCircle from "@/components/ProfileCircle";

type ProfileProps = {
  imageUrl: string | null;
  name?: string;
  status?: string;
};
const Profile: FC<ProfileProps> = ({ imageUrl, name, status }) => {
  return (
    <div className="flex flex-row gap-3">
      <ProfileCircle imageUrl={imageUrl} size={"size-10"} />
      <div className="">
        <div>{name}</div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {status}
        </div>
      </div>
    </div>
  );
};

export default Profile;
