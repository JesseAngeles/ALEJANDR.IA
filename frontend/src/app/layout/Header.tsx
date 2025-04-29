import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const sugerenciasBase = [
  { titulo: "La muerte del amor", autor: "Gaby Pérez Islas" },
  { titulo: "El amor y otros demonios", autor: "Gabriel García Márquez" },
  { titulo: "El amor en los tiempos de cólera", autor: "Gabriel García Márquez" },
  { titulo: "Cuentos de amor, de locura y de muerte", autor: "Horacio Quiroga" },
];

const Header: React.FC = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarOpcionesCuenta, setMostrarOpcionesCuenta] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const sugerenciasRef = useRef<HTMLDivElement>(null);
  const cuentaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [mostrarAvisoFavoritos, setMostrarAvisoFavoritos] = useState(false);


  const estaLogueado = true;
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node) &&
        sugerenciasRef.current &&
        !sugerenciasRef.current.contains(event.target as Node) &&
        cuentaRef.current &&
        !cuentaRef.current.contains(event.target as Node)
      ) {
        setMostrarMenu(false);
        setMostrarSugerencias(false);
        setMostrarOpcionesCuenta(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const irAResultados = (termino: string) => {
    if (termino.trim().length > 0) {
      navigate(`/resultados?query=${encodeURIComponent(termino)}`);
      setMostrarSugerencias(false);
    }
  };

  const sugerenciasFiltradas = sugerenciasBase.filter((s) =>
    s.titulo.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <header className="flex flex-wrap items-center justify-between p-4 border-b bg-white shadow-md relative z-10">
      {/* Menú de navegación */}
      <div className="relative" ref={contenedorRef}>
        <div className="flex items-center gap-4">
          <button
            className="text-2xl hover:text-gray-600"
            onClick={() => setMostrarMenu((prev) => !prev)}
          >
            <MdMenu />
          </button>
          <span className="text-sm font-semibold">Categorías</span>
          <h1 className="text-2xl font-bold ml-4">ALEJANDR.IA</h1>
        </div>

        {mostrarMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border p-4 flex gap-8 text-sm w-[500px] z-50">
            {/* Menú ficticio */}
            <div>
              <h4 className="font-semibold border-b mb-1">Ficción</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-600">Ciencia ficción</a></li>
                <li><a href="#" className="hover:text-blue-600">Fantasía</a></li>
                <li><a href="#" className="hover:text-blue-600">Romance</a></li>
                <li><a href="#" className="hover:text-blue-600">Misterio</a></li>
                <li><a href="#" className="hover:text-blue-600">Poesia</a></li>
                <li><a href="#" className="hover:text-blue-600">Clasicos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold border-b mb-1">No Ficción</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-blue-600">Ciencias Políticas</a></li>
                <li><a href="#" className="hover:text-blue-600">Economía</a></li>
                <li><a href="#" className="hover:text-blue-600">Filosofía</a></li>
                <li><a href="#" className="hover:text-blue-600">Lingüistica</a></li>
                <li><a href="#" className="hover:text-blue-600">Matemáticas</a></li>
                <li><a href="#" className="hover:text-blue-600">Química</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="relative w-full sm:w-1/2 my-2 sm:my-0" ref={sugerenciasRef}>
        <div className="flex items-center border rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            onFocus={() => setMostrarSugerencias(true)}
            className="w-full p-2 outline-none"
          />
          <button className="text-cyan-700 px-4" onClick={() => irAResultados(buscar)}>
            Buscar
          </button>
          <button className="text-gray-500 text-lg pr-3" onClick={() => irAResultados(buscar)}>
            <FaSearch />
          </button>
        </div>

        {mostrarSugerencias && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md border mt-1 z-50 max-h-80 overflow-y-auto">
            {buscar.length === 0 ? (
              <p className="p-4 text-sm text-gray-600">Empieza a escribir para mostrar sugerencias.</p>
            ) : sugerenciasFiltradas.length === 0 ? (
              <p className="p-4 text-sm text-gray-600">No se encontraron coincidencias.</p>
            ) : (
              sugerenciasFiltradas.map((s, idx) => (
                <button
                  key={idx}
                  className="flex justify-between items-start p-4 w-full text-left hover:bg-gray-100"
                  onClick={() => irAResultados(s.titulo)}
                >
                  <div>
                    <p className="font-medium">{s.titulo}</p>
                    <p className="text-sm text-gray-500">{s.autor}</p>
                  </div>
                  <FaArrowUpRightFromSquare className="text-gray-400 mt-1" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Botones de cuenta */}
      <div className="flex items-center gap-2 text-sm divide-x divide-gray-300 relative" ref={cuentaRef}>
        <button
          className="flex items-center gap-1 px-3 hover:text-blue-600"
          onClick={() => {
            if (estaLogueado) {
              navigate("/account/profile");
            } else {
              setMostrarOpcionesCuenta((prev) => !prev);
            }
          }}
        >
          <FaUser />
          <span className="hidden sm:inline">Mi cuenta</span>
        </button>
        <button
          className="flex items-center gap-1 px-3 hover:text-blue-600"
          onClick={() => {
            if (estaLogueado) {
              navigate("/mis-favoritos");
            } else {
              setMostrarAvisoFavoritos(true);
            }
          }}
        >
          <FaHeart />
          <span className="hidden sm:inline">Favoritos</span>
        </button>

        <button className="flex items-center gap-1 px-3 hover:text-blue-600">
          <FaShoppingCart />
          <span onClick={() => navigate('/cart')} className="hidden sm:inline">Carrito</span>
        </button>

        {/* Menú desplegable para iniciar/registrar */}
        {mostrarOpcionesCuenta && !estaLogueado && (
          <div className="absolute top-full right-0 bg-white shadow-md border mt-2 w-48 rounded z-50 p-4">
            <p className="text-sm font-semibold mb-2">Escoge una opción para entrar:</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-cyan-700 text-white text-sm py-1 rounded mb-2 hover:bg-cyan-800 transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="w-full bg-cyan-100 text-cyan-800 text-sm py-1 rounded hover:bg-cyan-200 transition"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
      {mostrarAvisoFavoritos && !estaLogueado && (
        <div className="absolute top-full right-16 bg-white shadow-md border mt-2 w-64 rounded z-50 p-4">
          <p className="text-sm font-semibold mb-2 text-center">
            Inicia sesión o regístrate para acceder a <span className="text-cyan-700 font-bold">Mis Favoritos</span>
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-cyan-700 text-white text-sm py-1 rounded mb-2 hover:bg-cyan-800 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/registro")}
            className="w-full bg-cyan-100 text-cyan-800 text-sm py-1 rounded hover:bg-cyan-200 transition"
          >
            Registrarse
          </button>
        </div>
      )}

    </header>
  );
};

export { Header };
