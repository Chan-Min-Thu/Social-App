import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import api, { authApi } from "@/api/index";
import useAuthStore, { SignUpStatus } from "@/store/authStore";
import useUserStore from "@/store/userStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  const { getUser } = useUserStore.getState();
  try {
    const response = await authApi.post("login", credentials);
    getUser({
      id: response.data.data.userId,
      email: response.data.data.email,
      username: response.data.data.username,
      avatarUrl: response.data.data.avatarUrl,
    });
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
  const { reset } = useUserStore.getState();
  try {
    await api.post("logout");
    reset();
    return redirect("/login");
  } catch (error) {
    console.error("error :", error);
  }
};

export const signUpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  // const { getUser } = useUserStore.getState();
  try {
    const response = await authApi.post("register", credentials);
    if (response.status !== 200) {
      return response.data.message || "Sending OTP failed!";
    }
    // getUser({
    //   id: response.data.data.userId,
    //   email: response.data.data.email,
    //   username: response.data.data.username,
    //   avatarUrl: response.data.data.avatarUrl,
    // });
    //client state management
    authStore.setAuth(
      response?.data.email,
      response?.data.token,
      SignUpStatus.verify,
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
      SignUpStatus.confirmPassword,
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
  try {
    const response = await authApi.post("confirm-password", credentials);
    if (response.status !== 200) {
      return response.data.message || "Regristration failed!";
    }
    authStore.setAuth(
      response?.data.email,
      response?.data.token,
      SignUpStatus.userProfile,
    );

    return redirect("/signup/user-profile");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration failed!" };
    } else throw error;
  }
};

export const userProfileAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const { getUser } = useUserStore.getState();
  const formData = await request.formData();
  try {
    const response = await api.post("profile/user-profile", formData,{
      headers:{
        "Content-Type": "multipart/form-data"
      }
    });
    if (response.status !== 200) {
      return response.data.message || "Registeration of profile failed";
    }
    console.log("response from user profile api", response.data.data.id);

    getUser({
      id: response.data.data.id,
      email: response.data.data.email,
      username: response.data.data.username,
      avatarUrl: response.data.data.avatarUrl,
    });
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration failed!" };
    } else throw error;
  }
};
