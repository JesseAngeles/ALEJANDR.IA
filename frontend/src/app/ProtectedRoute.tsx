import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/domain/context/AuthContext";

type Props = {
    children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export { ProtectedRoute };
