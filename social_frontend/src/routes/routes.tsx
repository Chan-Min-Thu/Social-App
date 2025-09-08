import { createBrowserRouter } from "react-router";
import AppLayout from "../pages/home/Applayout";
import Login from "../pages/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
  },
  {
    path: "/login",
    Component: Login,
  },
  {},
]);

export default router;
