import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const AdminFooter: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <footer className="bg-[#820000] text-white p-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div>
          <h3 className="font-bold">Contáctanos</h3>
          <p>alejandria.contacto@gmail.com</p>
        </div>
        <div className="mt-3 md:mt-0">
          <h3 className="font-bold text-right">Síguenos</h3>
          <div className="flex justify-end gap-4 text-xl mt-1">
            <FaInstagram className="cursor-pointer" />
            <FaFacebookF className="cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export { AdminFooter };
