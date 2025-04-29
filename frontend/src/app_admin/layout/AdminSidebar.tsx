import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { name: "Inicio", path: "/admin", exact: true },
  { name: "Gestión de libros", path: "/admin/libros" },
  { name: "Pedidos", path: "/admin/pedidos" },
  { name: "Clientes", path: "/admin/clientes" },
  { name: "Reportes", path: "/admin/reportes/ventas" },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 border-r p-4">
      <ul className="space-y-2">
        {links.map(({ name, path, exact }) => (
          <li key={name}>
            <NavLink
              to={path}
              end={exact} // Solo "Inicio" requiere coincidencia exacta
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-[#820000]"
                  : "text-black hover:underline"
              }
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export { AdminSidebar };
