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
import { useToast } from "../domain/context/ToastContext";

const Header: React.FC = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [resultados, setResultados] = useState<{ titulo: string; autor: string; id: string; portada: string; isbn: string }[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarOpcionesCuenta, setMostrarOpcionesCuenta] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de confirmación
  const [redirectPath, setRedirectPath] = useState(""); // Para guardar la ruta de redirección (Carrito o Favoritos)
  

  const contenedorRef = useRef<HTMLDivElement>(null);
  const sugerenciasRef = useRef<HTMLDivElement>(null);
  const cuentaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useCart();
  const { backup, clearBackup } = useCartBackup();

  const estaLogueado = !!localStorage.getItem("token");

  const { showToast } = useToast();  // Usamos el contexto de toast
  const { state } = useLocation();
  const { welcomeMessage } = state || {}; 


  useEffect(() => {
    if (welcomeMessage && !sessionStorage.getItem('toastShown')) {
      showToast(welcomeMessage, "success");
      sessionStorage.setItem('toastShown', 'true');  // Aseguramos que el toast solo se muestre una vez
    }
  }, [welcomeMessage, showToast]);

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


  const handleRedirect = (path: string) => {
    if (!estaLogueado) {
      setRedirectPath(path);
      setShowModal(true); // Muestra el modal de confirmación
    } else {
      navigate(path); // Si está logueado, redirige directamente
    }
  };

  const handleModalResponse = (response: boolean) => {
    setShowModal(false); // Cierra el modal
    if (response && !estaLogueado) {
      navigate("/login"); // Redirige al login
    } else if (response && estaLogueado) {
      navigate(redirectPath); // Redirige a la ruta de destino
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
              handleRedirect("/account/profile"); // Muestra el modal si no está logueado
            }
          }}
        >
    <FaUser />
    <span className="hidden sm:inline">Mi cuenta</span>
  </button>

  <button
          className="flex items-center gap-1 px-3 hover:text-blue-600"
          onClick={() => handleRedirect("/mis-favoritos")} // Muestra el modal si no está logueado
        >
          <FaHeart />
          <span className="hidden sm:inline">Favoritos</span>
        </button>

        <button
          className="flex items-center gap-1 px-3 hover:text-blue-600"
          onClick={() => handleRedirect("/cart")} // Muestra el modal si no está logueado
        >
          <FaShoppingCart />
          <span className="hidden sm:inline">Carrito</span>
        </button>
</div>

          {/* Modal de confirmación */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4">¿Deseas iniciar sesión para continuar?</h3>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleModalResponse(true)} // Confirmar
          className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
        >
          Sí
        </button>
        <button
          onClick={() => handleModalResponse(false)} // Cancelar
          className="bg-[#f44336] text-white px-4 py-2 rounded hover:bg-[#d32f2f]"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}



    </header>
  );
};

export { Header };
