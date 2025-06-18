import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/domain/context/AuthContext";

const AccountSidebar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de confirmación

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `block pl-2 border-l-4 text-sm cursor-pointer ${isActive
            ? "text-[#820000] font-semibold border-[#820000]"
            : "text-black hover:font-medium border-transparent hover:border-gray-400"
        }`;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="w-full md:w-64 border rounded bg-gray-100 p-4 flex flex-col justify-between min-h-[300px]">
            <ul className="space-y-2">
                <li>
                    <NavLink to="/account/profile" className={linkClasses}>
                        Mi perfil
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/account/payment" className={linkClasses}>
                        Mis métodos de pago
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/account/addresses" className={linkClasses}>
                        Mis direcciones de envío
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/account/history" className={linkClasses}>
                        Mi historial de pedidos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mis-favoritos" className={linkClasses}>
                        Mis favoritos
                    </NavLink>
                </li>
            </ul>

            <button
                className="mt-8 text-sm text-red-600 hover:underline text-left"
                onClick={() => setShowModal(true)} // Mostrar modal de confirmación
            >
                Cerrar sesión
            </button>

            {/* Modal de confirmación de cerrar sesión */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-[#00000] mb-4">
                            ¿Estás seguro de que deseas cerrar sesión?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-[#820000] text-white px-4 py-2 rounded hover:bg-[#660000]"
                            >
                                Sí, cerrar sesión
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export { AccountSidebar };
