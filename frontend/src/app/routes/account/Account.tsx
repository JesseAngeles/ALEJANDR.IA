import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const Account: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Regresar */}
      <button className="flex items-center text-sm text-black mb-6 hover:underline">
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border rounded bg-gray-100 p-4 text-sm">
          <ul className="space-y-2">
            <li className="text-[#820000] font-semibold border-l-4 border-[#820000] pl-2">
              Mi perfil
            </li>
            <li className="hover:font-medium cursor-pointer border-l-4 border-transparent hover:border-gray-400 pl-2">
              Mis métodos de pago
            </li>
            <li className="hover:font-medium cursor-pointer border-l-4 border-transparent hover:border-gray-400 pl-2">
              Mis direcciones de envío
            </li>
            <li className="hover:font-medium cursor-pointer border-l-4 border-transparent hover:border-gray-400 pl-2">
              Mi historial de pedidos
            </li>
            <li className="hover:font-medium cursor-pointer border-l-4 border-transparent hover:border-gray-400 pl-2">
              Mis favoritos
            </li>
          </ul>
        </aside>

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

export { Account };
