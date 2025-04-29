// src/app/routes/account/Account.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Regresar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <AccountSidebar />

        {/* Formulario */}
        <section className="flex-1">
          <h2 className="text-2xl font-bold text-[#820000] mb-6">Mi perfil</h2>

          <form className="space-y-5">
            <div>
              <label className="block font-medium">Nombre*:</label>
              <input
                type="text"
                className="w-full border border-black rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Apellidos*:</label>
              <input
                type="text"
                className="w-full border border-black rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Correo electrónico:</label>
              <input
                type="email"
                className="w-full border border-black rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block font-medium">Contraseña:</label>
              <input
                type="password"
                className="w-full border border-black rounded px-3 py-2 mt-1"
              />
              <button
                type="button"
                className="text-[#007B83] text-sm mt-1 hover:underline"
              >
                Cambiar contraseña
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
              >
                Editar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export { Profile };
