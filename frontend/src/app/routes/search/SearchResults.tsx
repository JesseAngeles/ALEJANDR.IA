import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { useLocation } from 'react-router-dom'; 
import { useToast } from '@/app/domain/context/ToastContext';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  precio: number;
  valoracion: number;
  portada: string;
  isbn: string;
  numOpiniones: number;
  stock: number; // Añadido stock
};

type Filtro = {
  seccion: string;
  opciones: string[];
};

type Props = {
  terminoBusqueda: string;
  resultados: Libro[];
  filtrosDisponibles: Filtro[];
  filtroInicial?: string;
};

const SearchResults: React.FC<Props> = ({
  terminoBusqueda,
  resultados,
  filtrosDisponibles,
  filtroInicial,
}) => {
  const [filtroAutor, setFiltroAutor] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [precioMin, setPrecioMin] = useState<number | "">("");
  const [precioMax, setPrecioMax] = useState<number | "">("");
  const [precioError, setPrecioError] = useState<string | null>(null);
  const [valoracionMin, setValoracionMin] = useState<number>(0);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const { favoritos, addToFavorites, removeFromFavorites } = useFavorites();
  const estaLogueado = !!localStorage.getItem("token");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const { showToast } = useToast();

  const navigate = useNavigate();

  const autoresUnicos = Array.from(new Set(resultados.map((l) => l.autor))).sort();
  const categoriasUnicas = Array.from(new Set(resultados.map((l) => l.categoria))).sort();

  const location = useLocation(); 
  useEffect(() => {
    fetchCart(); 
  }, [location]);

  // Aplica el filtro automático solo una vez
  useEffect(() => {
    if (filtroAplicado) return;

    if (filtroInicial === "autor") {
      const match = autoresUnicos.find((a) =>
        a.toLowerCase() === terminoBusqueda.toLowerCase()
      );
      if (match) {
        setFiltroAutor(match);
        setFiltroAplicado(true);
      }
    }

    if (filtroInicial === "categoria") {
      const match = categoriasUnicas.find((c) =>
        c.toLowerCase() === terminoBusqueda.toLowerCase()
      );
      if (match) {
        setFiltroCategoria(match);
        setFiltroAplicado(true);
      }
    }
  }, [filtroInicial, terminoBusqueda, autoresUnicos, categoriasUnicas, filtroAplicado]);

  const resultadosFiltrados = resultados.filter((libro) => {
    const autoresLibro = libro.autor.split(",").map((a) => a.trim());

    const cumpleMin = precioMin === "" || libro.precio >= precioMin;
    const cumpleMax = precioMax === "" || libro.precio <= precioMax;

    const precioValido =
      precioMin === "" ||
      precioMax === "" ||
      (typeof precioMin === "number" &&
        typeof precioMax === "number" &&
        precioMin <= precioMax);

    // Setea error si es inválido
    if (!precioValido) {
      if (!precioError) setPrecioError("El precio mínimo no puede ser mayor que el máximo.");
      return false;
    } else {
      if (precioError) setPrecioError(null);
    }

    return (
      (!filtroAutor || autoresLibro.includes(filtroAutor)) &&
      (!filtroCategoria || libro.categoria === filtroCategoria) &&
      cumpleMin &&
      cumpleMax &&
      libro.valoracion >= valoracionMin &&
      (!soloDisponibles || libro.stock > 0)
    );
  });

  return (
    <div className="flex min-h-screen">
      {/* Panel de filtros */}
      <aside className="w-64 p-4 border-r text-sm space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-black hover:underline mb-4"
        >
          <FaArrowLeft className="mr-2 text-black" />
          Regresar
        </button>

        {/* Filtro: Autor */}
        <div>
          <h3 className="font-semibold mb-1">Autor</h3>
          <select
            value={filtroAutor ?? ""}
            onChange={(e) => setFiltroAutor(e.target.value || null)}
            className="w-full border rounded p-1"
          >
            <option value="">Todos</option>
            {autoresUnicos.map((autor) => (
              <option key={autor} value={autor}>
                {autor}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Categoría */}
        <div>
          <h3 className="font-semibold mb-1">Categoría</h3>
          <select
            value={filtroCategoria ?? ""}
            onChange={(e) => setFiltroCategoria(e.target.value || null)}
            className="w-full border rounded p-1"
          >
            <option value="">Todas</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Precio */}
        <div>
          <h3 className="font-semibold mb-1">Precio (MXN)</h3>
          <div className="flex gap-2">
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-600 mb-1">Mínimo</label>
              <input
                type="number"
                min={0}
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value === "" ? "" : parseFloat(e.target.value))}
                placeholder="Mínimo"
                className="w-full border rounded p-1"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-xs text-gray-600 mb-1">Máximo</label>
              <input
                type="number"
                min={0}
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value === "" ? "" : parseFloat(e.target.value))}
                placeholder="Máximo"
                className="w-full border rounded p-1"
              />
            </div>
          </div>
          {precioError && <p className="text-xs text-red-500 mt-1">{precioError}</p>}
        </div>

        {/* Filtro: Valoración */}
        <div>
          <h3 className="font-semibold mb-1">Valoración mínima</h3>
          <input
            type="number"
            min={0}
            max={5}
            step={0.5}
            value={valoracionMin}
            onChange={(e) => setValoracionMin(parseFloat(e.target.value))}
            className="w-full border rounded p-1"
          />
        </div>

        {/* Filtro: Disponibilidad  */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
            />
            Mostrar solo disponibles
          </label>
        </div>
      </aside>

      {/* Resultados */}
      <main className="flex-grow px-4 py-4">
        {!["autor", "categoria"].includes(filtroInicial || "") && (
          <h2 className="text-lg font-semibold">
            Resultados de búsqueda para:{" "}
            <span className="text-red-700">{terminoBusqueda}</span>
          </h2>
        )}

        {resultadosFiltrados.length === 0 ? (
          <p className="mt-6 text-gray-600">No se encontraron resultados.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
            {resultadosFiltrados.map((libro) => (
              <div
                key={libro.id}
                className="group relative w-44 flex-shrink-0 border rounded-lg shadow-sm overflow-hidden pb-7 cursor-pointer"
                onClick={() => navigate(`/book/${libro.isbn}`)}
              >
                <img
                  src={libro.portada}
                  alt={libro.titulo}
                  className="w-full h-60 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{libro.titulo}</h3>
                  <p className="text-xs text-gray-500 truncate">{libro.autor}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-700 font-medium">
                      {libro.valoracion.toFixed(1)}
                    </span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < Math.round(libro.valoracion) ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-500">
                      ({libro.numOpiniones})
                    </span>
                  </div>
                  <p className={`text-sm font-medium mt-1 ${libro.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {libro.stock === 0 ? 'No disponible' : libro.stock === 1 ? '1 disponible' : `${libro.stock} disponibles`}
                  </p>
                </div>

                {/* Botón de carrito */}
                <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!estaLogueado) return navigate("/login");
                      const enCarrito = cart.some(c => c.bookId === libro.id);
                      try {
                        if (enCarrito) {
                          await removeFromCart(libro.isbn);
                          showToast("Libro eliminado del carrito", "error");
                        } else {
                          await addToCart(libro.isbn);
                          showToast("Libro añadido al carrito", "success");
                        }
                        await fetchCart();
                      } catch (error) {
                        console.error("Error al modificar el carrito:", error);
                      }
                    }}
                    className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${libro.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : (cart.some(c => c.bookId === libro.id) ? 'bg-red-600' : 'bg-cyan-600')}`}
                    disabled={libro.stock === 0} // Deshabilitar si no hay stock
                  >
                    {libro.stock === 0 ? 'No disponible' : (cart.some(c => c.bookId === libro.id) ? 'Eliminar del carrito' : 'Añadir al carrito')}
                    <FaShoppingCart className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { SearchResults };
