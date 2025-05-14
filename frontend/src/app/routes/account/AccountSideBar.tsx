import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/domain/context/AuthContext";

const AccountSidebar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

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
                onClick={handleLogout}
            >
                Cerrar sesión
            </button>
        </aside>
    );
};

export { AccountSidebar };
