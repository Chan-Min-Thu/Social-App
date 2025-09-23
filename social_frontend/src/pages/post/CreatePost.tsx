import { FaceIcon, ImageIcon, ZoomInIcon } from "@radix-ui/react-icons";
import { createPostIcons } from "../../config/CreatePost";

export default function CreatePost() {
  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <div className="card-body">
        <div className=" flex items-center gap-4 justify-between w-full">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
            </div>
          </div>
          <div className="w-full">
            <button className="btn btn-ghost w-full justify-start text-sm font-medium">
              What's on your mind?
            </button>
          </div>
        </div>
        <div className="card-actions px-14 justify-between mt-4">
          {createPostIcons.map((post, index) => (
            <div key={index}>
              {post.input && <input hidden type="file" />}
              <button className="btn btn-outline btn-sm">
                {" "}
                <post.icon /> {post.name}
              </button>
            </div>
          ))}
     
          <div>
            <button className="btn btn-primary btn-sm"> Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
