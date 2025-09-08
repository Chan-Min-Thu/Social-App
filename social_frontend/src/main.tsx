import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import router from "./routes/routes";
import { StrictMode } from "react";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
