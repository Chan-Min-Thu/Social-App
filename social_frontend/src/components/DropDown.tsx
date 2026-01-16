import type { FC } from "react";
import { useNavigate } from "react-router";
import Button from "./Button";
import DialogBox from "./DialogBox";

type DropDownProps = {
  onClick: () => void;
  id: string;
};
const DropDown: FC<DropDownProps> = ({ onClick, id }) => {
  const navigate = useNavigate();
  return (
    <div>
      <DialogBox onClick={onClick} title="Remove friend" />
      <details className="dropdown">
        <summary className="btn m-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 6.625C1.01675 6.625 0.625 7.01675 0.625 7.5C0.625 7.98325 1.01675 8.375 1.5 8.375C1.98325 8.375 2.375 7.98325 2.375 7.5C2.375 7.01675 1.98325 6.625 1.5 6.625ZM5.5 6.625C5.01675 6.625 4.625 7.01675 4.625 7.5C4.625 7.98325 5.01675 8.375 5.5 8.375C5.98325 8.375 6.375 7.98325 6.375 7.5C6.375 7.01675 5.98325 6.625 5.5 6.625ZM9.5 6.625C9.01675 6.625 8.625 7.01675 8.625 7.5C8.625 7.98325 9.01675 8.375 9.5 8.375C9.98325 8.375 10.375 7.98325 10.375 7.5C10.375 7.01675 9.98325 6.625 9.5 6.625ZM12.625 7.5C12.625 7.01675 13.0168 6.625 13.5 6.625C13.9832 6.625 14.375 7.01675 14.375 7.5C14.375 7.98325 13.9832 8.375 13.5 8.375C13.0168 8.375 12.625 7.98325 12.625 7.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li className="m-1">
            <Button
              type="button"
              content="View Profile"
              onClick={() => navigate(`/profile/${id}`)}
            />
          </li>
          <li className="m-1">
            <Button
              type="button"
              content="Remove Friend"
              onClick={() => {
                const modal = document.getElementById("my_modal_1");
                modal?.showModal();
              }}
            />
          </li>
        </ul>
      </details>
    </div>
  );
};

export default DropDown;
