
import React from "react";
import { FaHome } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AdminHeader: React.FC = () => {
  const location = useLocation();

  return (
    <header className="relative flex justify-center items-center border-b p-4">
      <h1 className="text-xl font-serif text-[#000000]">ALEJANDR.IA</h1>
      <Link
        to="/admin"
        className={`absolute right-6 top-1/2 -translate-y-1/2 flex items-center text-sm ${
          location.pathname === "/admin" ? "text-[#820000] font-semibold" : "text-black"
        } hover:underline`}
      >
        <FaHome className="mr-1" /> Inicio
      </Link>
    </header>
  );
};

export { AdminHeader };
