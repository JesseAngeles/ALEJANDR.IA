import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { searchService } from "../domain/service/searchService";
import { FaHome } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useCart } from "../domain/context/CartContext";
import { cartService } from "../domain/service/cartService";
import { useCartBackup } from "../domain/context/CartBackupContext";


const Header: React.FC = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [resultados, setResultados] = useState<{ titulo: string; autor: string; id: string; portada: string; isbn: string }[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarOpcionesCuenta, setMostrarOpcionesCuenta] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);


  const contenedorRef = useRef<HTMLDivElement>(null);
  const sugerenciasRef = useRef<HTMLDivElement>(null);
  const cuentaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useCart();
  const { backup, clearBackup } = useCartBackup();

  const estaLogueado = !!localStorage.getItem("token");


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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const buscarLibros = async () => {
        if (buscar.trim().length === 0) return setResultados([]);

        try {
          const libros = await searchService.buscar(buscar);
          setResultados(libros);
        } catch (error) {
          console.error("❌ Error en búsqueda:", error);
          setResultados([]);
        }
      };

      buscarLibros();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [buscar]);

  

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const libros: {
          categoria: string;
        }[] = await searchService.buscarTodos();
  
        const todasCategorias: string[] = libros.map((l) => l.categoria).filter(Boolean);
        const unicas: string[] = Array.from(new Set(todasCategorias)).sort((a, b) =>
          a.localeCompare(b)
        );
  
        setCategorias(unicas);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
  
    cargarCategorias();
  }, []);
  
  
  
useEffect(() => {
  const rutasCompra = ["/address","/address/add", "/payment", "/payment/add", "/cvc", "/summary", "/confirmation", "/address/edit"];
  const estaEnCompra = rutasCompra.some((ruta) => location.pathname.startsWith(ruta));

  if (!estaEnCompra && backup.length > 0) {
    const restaurar = async () => {
      try {
        await cartService.emptyCart();
        for (const item of backup) {
          await cartService.addToCart(item.isbn, item.quantity);
        }
        await fetchCart();
        clearBackup();
        console.log("✅ Carrito restaurado desde backup del contexto");
      } catch (error) {
        console.error("❌ Error al restaurar carrito desde backup:", error);
      }
    };

    restaurar();
  }
}, [location]);


  const irAResultados = (termino: string, filtro?: string) => {
    if (termino.trim().length > 0) {
      const url = `/busqueda?query=${encodeURIComponent(termino)}${filtro ? `&filtro=${filtro}` : ""}`;
      navigate(url);
      setMostrarSugerencias(false);
    }
  };


  return (
    <header className="flex flex-wrap items-center justify-between p-4 border-b bg-white shadow-md relative z-10">
      {/* Menú de navegación */}
      <div className="relative" ref={contenedorRef}>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-sm font-semibold hover:text-gray-600"
            onClick={() => setMostrarMenu((prev) => !prev)}
          >
            <MdMenu className="text-2xl" />
            Categorías
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-serif ml-4 hover:text-blue-600 transition"
          >
            ALEJANDR.IA
          </button>
        </div>


        {mostrarMenu && (
  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border p-4 text-sm w-[500px] z-50 max-h-80 overflow-y-auto">
    <ul className="space-y-1">
      {categorias.map((cat, idx) => (
        <li key={idx}>
          <button
            className="hover:text-blue-600"
            onClick={() => {
              navigate(`/busqueda?query=${encodeURIComponent(cat)}&filtro=categoria`);
              setMostrarMenu(false);
            }}
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Previene que un formulario se envíe, si aplica
                irAResultados(buscar);
              }
            }}
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
            ) : resultados.length === 0 ? (
              <p className="p-4 text-sm text-gray-600">No se encontraron coincidencias.</p>
            ) : (
              resultados.map((s, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start p-4 w-full text-left hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/book/${s.isbn}`)}
                >
                  <div className="w-full">
                    <p className="font-medium">{s.titulo}</p>
                    <div className="flex flex-wrap gap-1 mt-1 text-sm text-blue-600">
                      {s.autor.split(",").map((nombre, i, arr) => (
                        <span key={i}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              irAResultados(nombre.trim(), "autor");
                            }}
                            className="hover:underline"
                          >
                            {nombre.trim()}
                          </button>
                          {i < arr.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FaArrowUpRightFromSquare className="text-gray-400 mt-1" />
                </div>

              ))

            )}
          </div>
        )}
      </div>

      {/* Botones de cuenta */}
<div className="flex items-center gap-2 text-sm divide-x divide-gray-300 relative" ref={cuentaRef}>
  <button
    className="flex items-center gap-1 px-3 hover:text-blue-600"
    onClick={() => navigate("/")}
  >
    <FaHome />
    <span className="hidden sm:inline">Inicio</span>
  </button>

  <button
    className="flex items-center gap-1 px-3 hover:text-blue-600"
    onClick={() => {
      if (estaLogueado) {
        navigate("/account/profile");
      } else {
        navigate("/login");
      }
    }}
  >
    <FaUser />
    <span className="hidden sm:inline">Mi cuenta</span>
  </button>

  <button
    className="flex items-center gap-1 px-3 hover:text-blue-600"
    onClick={() => navigate(estaLogueado ? "/mis-favoritos" : "/login")}
  >
    <FaHeart />
    <span className="hidden sm:inline">Favoritos</span>
  </button>

  <button
    className="flex items-center gap-1 px-3 hover:text-blue-600"
    onClick={() => {
      if (estaLogueado) {
        navigate("/cart");
      } else {
        navigate("/login");
      }
    }}
  >
    <FaShoppingCart />
    <span className="hidden sm:inline">Carrito</span>
  </button>
</div>


    </header>
  );
};

export { Header };
