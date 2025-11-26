import { redirect, type ActionFunctionArgs } from "react-router";
import { AxiosError } from "axios";
import api from "../../api";

export const postAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await api.post("posts", credentials);
    console.log(response);
    if (response.status !== 201) {
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
