import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { MdMenu } from "react-icons/md";

const Header: React.FC = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <header className="header-cliente flex flex-wrap items-center justify-between p-4 border-b bg-white shadow-md relative z-10">
      {/* Barra de navegación */}
      <div className="barra-navegacion flex items-center gap-4 relative"
           onMouseEnter={() => setMostrarMenu(true)}
           onMouseLeave={() => setMostrarMenu(false)}>
        <button className="boton-navegacion text-2xl hover:text-gray-600">
          <MdMenu />
        </button>
        <span className="text-sm font-semibold">Categorías</span>
        <h1 className="text-2xl font-bold ml-4">ALEJANDR.IA</h1>

        {/* Desplegar categorías */}
        {mostrarMenu && (
          <div className="desplegar-categorias absolute top-full left-0 mt-2 bg-white shadow-lg border p-4 flex gap-8 text-sm w-[500px]">
            <div>
              <h4 className="font-semibold border-b mb-1">Ficción</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-600">Ciencia ficción</a></li>
                <li><a href="#" className="hover:text-blue-600">Fantasía</a></li>
                <li><a href="#" className="hover:text-blue-600">Romance</a></li>
                <li><a href="#" className="hover:text-blue-600">Misterio</a></li>
                <li><a href="#" className="hover:text-blue-600">Poesía</a></li>
                <li><a href="#" className="hover:text-blue-600">Clásicos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold border-b mb-1">No Ficción</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-600">Ciencias Políticas</a></li>
                <li><a href="#" className="hover:text-blue-600">Economía</a></li>
                <li><a href="#" className="hover:text-blue-600">Filosofía</a></li>
                <li><a href="#" className="hover:text-blue-600">Lingüística</a></li>
                <li><a href="#" className="hover:text-blue-600">Matemáticas</a></li>
                <li><a href="#" className="hover:text-blue-600">Química</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="barra-busqueda w-full sm:w-1/2 my-2 sm:my-0">
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          className="ventana-busqueda w-full p-2 border rounded-md"
        />
      </div>

      {/* Botones de cuenta */}
      <div className="flex items-center gap-2 text-sm divide-x divide-gray-300">
        <button className="flex items-center gap-1 px-3 hover:text-blue-600">
          <FaUser />
          <span className="hidden sm:inline">Mi cuenta</span>
        </button>
        <button className="flex items-center gap-1 px-3 hover:text-blue-600">
          <FaHeart />
          <span className="hidden sm:inline">Favoritos</span>
        </button>
        <button className="flex items-center gap-1 px-3 hover:text-blue-600">
          <FaShoppingCart />
          <span className="hidden sm:inline">Carrito</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
