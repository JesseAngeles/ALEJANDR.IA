import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { name: "Ventas por periodo", path: "/admin/reportes/ventas" },
  { name: "Libros más vendidos", path: "/admin/reportes/populares" },
  { name: "Clientes frecuentes", path: "/admin/reportes/frecuentes" },
  { name: "Libros por estado", path: "/admin/reportes/estado" },
];

const ReportsLayout: React.FC = () => {
  return (
    <div className="px-8 py-4 w-full">
      <h2 className="text-2xl font-bold text-[#820000] mb-4">Reportes</h2>
      <nav className="mb-6 space-x-4 border-b pb-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              isActive
                ? "text-[#820000] font-semibold border-b-2 border-[#820000]"
                : "text-black hover:underline"
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export { ReportsLayout };
