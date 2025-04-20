import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { adminRouter } from "./router";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import "../assets/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <RouterProvider router={adminRouter} />
    </AdminAuthProvider>
  </React.StrictMode>
);
