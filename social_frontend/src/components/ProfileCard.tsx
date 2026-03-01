import type { UserProfileType } from "@/types/user.type";
import ImageInput from "./ImageInput";
import imageUrl from "../config/imageUrl";
import p1 from "../assets/no-cover.png";
import ProfileCircle from "./ProfileCircle";

type ProfileCardProps = {
  profile: UserProfileType;
  postLength?: number;
  friendLength?: number;
  isFriendProfile: boolean;
};

// const imageUrl = import.meta.env.VITE_IMAGE_API_URL;
const ProfileCard = ({
  profile,
  postLength,
  friendLength,
  isFriendProfile,
}: ProfileCardProps) => {
  const { coverUrl, avatarUrl, website, username } = profile;

  const profileUrl = imageUrl  + avatarUrl;
  const avatarUrlPath = avatarUrl?.startsWith("http") ? avatarUrl : profileUrl;
  const coverImageUrl = imageUrl  + coverUrl;
  return (
    <div className="card bg-base-100 w-full h-full   shadow-sm relative">
      <figure className="lg:h-64 h-64 w-full relative">
        <img src={coverUrl ? coverImageUrl : p1} alt="cover image" />
        {!isFriendProfile && (
          <div className="absolute bottom-3 z-20 right-6">
            <ImageInput type="cover" />
          </div>
        )}
      </figure>

      <div className="card-body h-72 flex justify-center">
        <div className="absolute z-10 top-[40%] left-8  ">
          <ProfileCircle imageUrl={!avatarUrl?.length ? null:avatarUrlPath} size={"size-24"} />
          {!isFriendProfile && (
            <div className="absolute bottom-2 z-20 -right-3">
              <ImageInput type="profile" />
            </div>
          )}
        </div>
        <div className="mt-0.5">
          <div>
            <h2 className="card-title">{username ?? "No-name"}</h2>
            <span className="text">{website}</span>
          </div>
          <div className="divider"></div>
          <div className="flex justify-start w-64 gap-5">
            <div className=" text-center flex justify-center flex-col">
              <h2 className="text-3xl font-bold">{postLength}</h2>
              <span className="text-xs">Posts</span>
            </div>
            <div className=" text-center flex justify-center flex-col">
              <h2 className="text-3xl font-bold">{friendLength}</h2>
              <span className="text-xs">Friends</span>
            </div>
            <div className=" text-center flex justify-center flex-col">
              <h2 className="text-3xl font-bold">100</h2>
              <span className="text-xs">LIKES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
