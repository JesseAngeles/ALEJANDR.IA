import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/app_admin/context/AdminAuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };
