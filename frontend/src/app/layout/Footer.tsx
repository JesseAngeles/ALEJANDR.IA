
import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#7a0000] text-white p-6 mt-10 flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="mb-4 sm:mb-0">
        <h4 className="font-semibold text-base">Contáctanos</h4>
        <p>alejandria.contacto@gmail.com</p>
      </div>
      <div>
        <h4 className="font-semibold text-base">Síguenos</h4>
        <div className="flex gap-4 mt-1 text-xl">
          <a href="#" className="hover:text-gray-300"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-300"><FaFacebook /></a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
