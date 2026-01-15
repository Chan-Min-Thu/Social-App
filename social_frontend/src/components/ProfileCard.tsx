const ProfileCard = () => {
  return (
    <div className="card bg-base-100 w-full h-10/12 shadow-sm relative">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="absolute bottom-4 left-3 h-24 flex justify-between flex-row gap-2">
        <div className="avatar ">
          <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        <div className="flex h-full items-center">
          <h1 className="text">Chan Min Thu</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
