import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import router from "./routes/routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import "./index.css";
import { queryClient } from "./api/query";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
