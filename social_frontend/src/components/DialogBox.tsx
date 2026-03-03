import type { FC } from "react";
import Button from "@/components/Button";

type DialogBoxProps = {
  onClick: () => void;
  title: string;
};
const DialogBox: FC<DialogBoxProps> = ({ onClick, title }) => {
  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}!</h3>
          <p className="py-4">Are you sure to {title.toLowerCase()}?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              {/* if there is a button in form, it will close the modal */}
              <Button
                type="button"
                content="Remove"
                className=" btn-error"
                onClick={onClick}
              />
              <Button
                type="button"
                content="Cancle"
                onClick={() => {
                  (
                    document.getElementById(
                      "my_modal_1",
                    ) as HTMLDialogElement | null
                  )?.close();
                }}
              />
            </form>
          </div>
          <form method="dialog" className="modal-backdrop hidden">
            <button className="btn">Close</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DialogBox;
