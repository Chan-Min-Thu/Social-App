import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import { PersonIcon } from "@/components/icons/PersonIcon";

type EmptyProfileCardProps = {
  isFriendProfile: boolean;
};
const EmptyProfileCard = ({ isFriendProfile }: EmptyProfileCardProps) => {
  return (
    <div className="card bg-base-100 h-auto w-full shadow-sm">
      <div className="card-body flex gap-4 items-start ">
        <h2 className="card-title ">Profile Information</h2>
        <div className="text-center w-56 h-52 flex justify-center items-center gap-3 flex-col mx-auto my-5">
          <PersonIcon />
          <p>
            {isFriendProfile
              ? `He hasn't added his profile information yet. Other details to let others know more about you.`
              : `You haven't added your profile information yet. Add your bio,
            website, and other details to let others know more about you.`}
          </p>
          {!isFriendProfile && (
            <Button
              content="Create Infos"
              className="btn-primary"
              onClick={() => {
                (
                  document.getElementById(
                    "my_modal_2",
                  ) as HTMLDialogElement | null
                )?.showModal();
              }}
            />
          )}
        </div>
      </div>
      <Dialog image={[]} type="Create Profile" />
    </div>
  );
};

export default EmptyProfileCard;
