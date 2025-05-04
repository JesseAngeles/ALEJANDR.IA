import React from "react";
import { useAuth } from "@/app_admin/context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

const AdminHome: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // <- limpia sesión
    navigate("/admin/login"); // <- redirige al login
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-black mb-4">Bienvenido Gustavo</h2>
      <button
        onClick={handleLogout}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export { AdminHome };
