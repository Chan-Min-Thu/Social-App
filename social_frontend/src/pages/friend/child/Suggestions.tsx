import { PlusIcon } from "@radix-ui/react-icons";

export default function Suggestions() {
  return (
    <div className="w-full my-4">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          People You May Know.
        </li>
        <li className="list-row">
          <div>
            <img
              className="size-10 rounded-box"
              src="https://img.daisyui.com/images/profile/demo/1@94.webp"
            />
          </div>
          <div>
            <div>Dio Lupa</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Remaining Reason
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary btn-sm">
              <PlusIcon className="size-3" /> Add Friend
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
