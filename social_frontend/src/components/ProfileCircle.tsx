import p1 from "@/assets/no-profile.png";

type ProfileCircleType = {
  imageUrl: string | null;
  size: string;
};

const ProfileCircle = ({ imageUrl, size }: ProfileCircleType) => {
  return (
    <div
      tabIndex={0}
      role="button"
      className={`btn ${size}  btn-ghost btn-circle avatar`}
    >
      <div className=" rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src={imageUrl ? imageUrl : p1}
        />
      </div>
    </div>
  );
};

export default ProfileCircle;
