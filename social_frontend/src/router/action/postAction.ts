import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import api from "../../api";

export const postAction = async ({ request }: ActionFunctionArgs) => {
  // read incoming FormData from the request (useSubmit sent FormData)
  const formData = await request.formData();

  try {
    // override default JSON content-type so the browser sets the correct multipart boundary
    const response = await api.post("posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status !== 200) {
      return { error: response.data || "Cannot create post!" };
    }
    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Cannot create post!" };
    } else throw error;
  }
};
