import { createBrowserRouter, redirect } from "react-router";
import {
  confirmAction,
  loginAction,
  logoutAction,
  otpAction,
  signUpAction,
} from "../router/action/authAction";
import {
  confirmLoader,
  loginLoader,
  otpLoader,
} from "../router/loader/authLoader";
import AppLayout from "../pages/home/Applayout";
import Login from "../pages/login/Login";
import SignupLayout from "../pages/signup/SignupLayout";
import SignUp from "../pages/signup/child/SignUp";
import VerifyOtp from "../pages/signup/child/VerifyOtp";
import ConfirmPassword from "../pages/signup/child/ConfirmPassword";
import Friend from "../pages/friend/Friend";
import Setting from "../pages/setting/Setting";
import PostLayout from "../pages/post/PostLayout";
import Friends from "../pages/friend/child/Friends";
import Requests from "../pages/friend/child/Requests";
import Sent from "../pages/friend/child/Sent";
import Suggestions from "../pages/friend/child/Suggestions";
import ErrorBoundary from "../pages/ErrorBoundary";
import { postAction } from "../router/action/postAction";
import HydrateFallBack from "../components/HydrateFallBack";
import MyProfile from "../pages/profile/MyProfile";
import FriendProfile from "../pages/profile/child/FriendProfile";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: ErrorBoundary,
    // HydrateFallback: HydrateFallBack,
    children: [
      {
        index: true,
        // loader: postLoader,
        action: postAction,
        Component: PostLayout,
        HydrateFallback: HydrateFallBack,
      },
      {
        path: "/friends",
        Component: Friend,
        HydrateFallback: HydrateFallBack,
        children: [
          {
            index: true,
            Component: Friends,
          },
          {
            path: "requested",
            Component: Requests,
          },
          {
            path: "sent",
            Component: Sent,
          },
          {
            path: "toadd",
            Component: Suggestions,
          },
        ],
      },
      {
        path: "/profile",
        Component: MyProfile,
        children: [
          {
            path: ":id",
            Component: FriendProfile,
          },
        ],
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
    loader: loginLoader,
    action: loginAction,
    HydrateFallback: HydrateFallBack,
  },
  {
    path: "logout",
    action: logoutAction,
    loader: () => redirect("/"),
    HydrateFallback: HydrateFallBack,
  },
  {
    path: "signup",
    Component: SignupLayout,
    HydrateFallback: HydrateFallBack,
    children: [
      {
        index: true,
        Component: SignUp,
        loader: loginLoader,
        action: signUpAction,
      },
      {
        path: "verify",
        Component: VerifyOtp,
        loader: otpLoader,
        action: otpAction,
      },
      {
        path: "confirm-password",
        Component: ConfirmPassword,
        loader: confirmLoader,
        action: confirmAction,
      },
    ],
  },
]);

export default router;
