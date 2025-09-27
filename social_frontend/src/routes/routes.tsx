import { createBrowserRouter } from "react-router";
import AppLayout from "../pages/home/Applayout";
import Login from "../pages/login/Login";
import SignupLayout from "../pages/signup/SignupLayout";
import SignUp from "../pages/signup/child/SignUp";
import VerifyOtp from "../pages/signup/child/VerifyOtp";
import ConfirmPassword from "../pages/signup/child/ConfirmPassword";
import Friend from "../pages/friend/Friend";
import Setting from "../pages/setting/Setting";
import PostLayout from "../pages/post/PostLayout";


const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: PostLayout,
      },
      {
        path: "/friends",
        Component: Friend,
      },
      {
        path: "/settings",
        Component: Setting,
      },
    ],
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "signup",
    Component: SignupLayout,
    children: [
      {
        index: true,
        Component: SignUp,
      },
      {
        path: "verify",
        Component: VerifyOtp,
      },
      {
        path: "confirmPassword",
        Component: ConfirmPassword,
      },
    ],
  },
]);

export default router;
