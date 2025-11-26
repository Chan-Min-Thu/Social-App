import { redirect, type ActionFunctionArgs } from "react-router";
import api, { authApi } from "../../api/index";
import { AxiosError } from "axios";
import useAuthStore, { SignUpStatus } from "../../store/authStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("login", credentials);
    console.log(response);
    if (response.status !== 201) {
      return { error: response.data || "Login Failed!" };
    }
    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed!" };
    } else throw error;
  }
};

export const logoutAction = async () => {
  try {
    await api.post("logout");
    return redirect("/login");
  } catch (error) {
    console.error("error :", error);
  }
};

export const signUpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  try {
    const response = await authApi.post("register", credentials);
    if (response.status !== 200) {
      return response.data.message || "Sending OTP failed!";
    }
    //client state management
    authStore.setAuth(
      response?.data.email,
      response?.data.token,
      SignUpStatus.verify
    );
    return redirect("/signup/verify");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Sending OTP failed!" };
    } else throw error;
  }
};

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const otp = formData.get("otp");
  try {
    const response = await authApi.post("verify-otp", {
      email: authStore.email,
      token: authStore.token,
      otp,
    });
    if (response.status !== 200) {
      return response.data.message || "Verifying OTP failed!";
    }
    authStore.setAuth(
      response?.data.email,
      response?.data.token,
      SignUpStatus.confirmPassword
    );
    return redirect("/signup/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Verifying OTP failed!" };
    } else throw error;
  }
};

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const password = formData.get("password");
  const credentials = {
    email: authStore.email,
    token: authStore.token,
    password,
  };
  console.log(credentials);
  try {
    const response = await authApi.post("confirm-password", credentials);
    if (response.status !== 200) {
      return response.data.message || "Regristration failed!";
    }
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration failed!" };
    } else throw error;
  }
};
