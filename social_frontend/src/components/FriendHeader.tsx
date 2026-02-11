import { GroupPersonIcon } from "./icons/GroupPersonIcon";

export default function FriendHeader() {
  return (
    <div className="w-full flex justify-between">
      <div className=" flex justify-center gap-2">
        <GroupPersonIcon />
        <h1 className="text-xl font-bold">Friends</h1>
      </div>
    </div>
  );
}
