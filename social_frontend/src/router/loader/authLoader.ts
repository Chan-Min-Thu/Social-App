import { AxiosError } from "axios";
import { authApi } from "../../api/index";
import { redirect } from "react-router";
import useAuthStore, { SignUpStatus } from "../../store/authStore";

export const loginLoader = async () => {
  try {
    const response = await authApi.get("auth-check");
    if (response.status !== 200) {
      console.log("null");
      return null;
    }
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed!" };
    } else throw error;
  }
};

export const otpLoader = async () => {
  const authStore = await useAuthStore.getState();
  if (authStore?.status !== SignUpStatus.verify) {
    return redirect("/signup");
  }
  return null;
};

export const confirmLoader = async () => {
  const authStore = await useAuthStore.getState();
  if (authStore.status !== SignUpStatus.confirmPassword) {
    return redirect("/signup");
  }
  return null;
};
