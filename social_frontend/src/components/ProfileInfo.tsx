import type { UserInfoType } from "@/types/user.type";
import Button from "./Button";
import { PersonIcon } from "./icons/PersonIcon";
import { LocationIcon } from "./icons/LocationIcon";
import { CalendarIcon } from "./icons/CalendarIcon";
import Dialog from "./Dialog";

type ProfileInfoProps = {
  info: UserInfoType;
  id: string;
};

const ProfileInfo = ({ info, id }: ProfileInfoProps) => {
  const { bio, birthDate, location, gender } = info;
  const dateObj = new Date(birthDate);
  const genderText =
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <div className="card-body flex gap-4 items-start ">
        <div className="flex justify-between w-full">
          <h2 className="card-title pb-4">Profile Information</h2>
          <Button
            content="Update"
            className="btn-primary btn-sm"
            onClick={() => {
              (
                document.getElementById("my_modal_2") as HTMLDialogElement
              ).showModal();
            }}
          />
        </div>

        <p className=" text-lg">{bio}</p>
        <div className="flex justify-between gap-5">
          <div className="flex gap-1">
            <PersonIcon />
            <span>{genderText}</span>
          </div>
          <div className="flex gap-1">
            <LocationIcon />
            <span>{location}</span>
          </div>
          <div className="flex gap-1">
            <CalendarIcon />
            <span>
              {dateObj.toLocaleDateString("sv-SE", { timeZone: "UTC" })}
            </span>
          </div>
        </div>
      </div>
      <Dialog type="Update Profile" data={info} profileId={id} />
    </div>
  );
};

export default ProfileInfo;
