import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileInfoSchema } from "../utils/schema/ProfileInfoSchema";
import { useCreateProfile, useUpdateProfile } from "../hooks/createUserInfo";
import Button from "./Button";
import type { UserInfoType } from "@/types/user.type";

type UpdateProfileProps = {
  data: UserInfoType | undefined;
  profileId?: string;
};

const UpdateProfile = ({ data, profileId }: UpdateProfileProps) => {
  const mutation = useUpdateProfile();
  const normalizeGender = (
    gender: string | undefined,
  ): "Male" | "Female" | "None" => {
    if (!gender) return "None";
    const normalized =
      gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    return (
      ["Male", "Female", "None"].includes(normalized) ? normalized : "None"
    ) as "Male" | "Female" | "None";
  };

  const {
    handleSubmit,
    register,

    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      bio: data?.bio,
      location: data?.location,
      website: data?.website,
      gender: normalizeGender(data?.gender),
      birthDate: data
        ? new Date(data.birthDate).toISOString().split("T")[0]
        : "2025-06-15",
    },
  });
  //   const submit = useSubmit();

  const onSubmithandler = async (data: any) => {
    // Build FormData including files stored in selectedImage state
    // const formData = new FormData();
    await mutation.mutate({ profileId: profileId!, userInfo: data });
    reset();
    (document.getElementById("my_modal_2") as HTMLDialogElement).close();
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmithandler)}
        className="flex w-full gap-2 flex-col"
        method="dialog"
      >
        <div className="form-control mb-4">
          <input
            type="text"
            className="input md:w-[30vw] w-[80vw] focus:outline-none "
            placeholder="Bio..."
            {...register("bio", { required: "Bio is required" })}
          />
          {errors.bio && (
            <p className="text-error text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>
        <div className="form-control mb-4">
          <input
            type="text"
            className="input md:w-[30vw] w-[80vw] focus:outline-none "
            placeholder="Bangkok,Phaya Thai..."
            {...register("location", { required: "Location is required" })}
          />
          {errors.location && (
            <p className="text-error text-sm mt-1">{errors.location.message}</p>
          )}
        </div>
        <div className="form-control mb-4">
          <input
            type="text"
            className="input md:w-[30vw] w-[80vw] focus:outline-none "
            placeholder="chan@web.com"
            {...register("website", { required: "Website is required" })}
          />
          {errors.website && (
            <p className="text-error text-sm mt-1">{errors.website.message}</p>
          )}
        </div>
        <div className="form-control mb-4">
          <select
            defaultValue="Choose gender."
            {...register("gender", { required: "Gender is required." })}
            className="select md:w-[30vw] w-[80vw] focus:outline-none focus-within:outline-none "
          >
            <option>None</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          {errors.website && (
            <p className="text-error text-sm mt-1">{errors.website.message}</p>
          )}
        </div>
        <div className="form-control mb-4">
          <input
            type="date"
            className="input md:w-[30vw] w-[80vw] focus:outline-none "
            placeholder="2025-05-16"
            {...register("birthDate", { required: "Birth date is required" })}
          />
          {errors.birthDate && (
            <p className="text-error text-sm mt-1">
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-2"
          content={isSubmitting ? "Updating..." : "Update"}
        />
      </form>
    </div>
  );
};

export default UpdateProfile;
