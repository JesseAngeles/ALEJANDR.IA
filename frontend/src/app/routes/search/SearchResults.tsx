import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  precio: number;
  valoracion: number;
  portada: string;
  isbn: string;
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
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, 1000]);
  const [valoracionMin, setValoracionMin] = useState<number>(0);
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  const navigate = useNavigate();

  const autoresUnicos = Array.from(new Set(resultados.map((l) => l.autor))).sort();
  const categoriasUnicas = Array.from(new Set(resultados.map((l) => l.categoria))).sort();

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
    return (
      (!filtroAutor || autoresLibro.includes(filtroAutor)) &&
      (!filtroCategoria || libro.categoria === filtroCategoria) &&
      libro.precio >= rangoPrecio[0] &&
      libro.precio <= rangoPrecio[1] &&
      libro.valoracion >= valoracionMin
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
          <input
            type="range"
            min={0}
            max={1000}
            step={5}
            value={rangoPrecio[1]}
            onChange={(e) =>
              setRangoPrecio([rangoPrecio[0], parseInt(e.target.value)])
            }
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            Máx: ${rangoPrecio[1].toFixed(2)}
          </p>
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
      </aside>

      {/* Resultados */}
      <main className="flex-grow p-6">
      {!["autor", "categoria"].includes(filtroInicial || "") && (
  <h2 className="text-lg font-semibold">
    Resultados de búsqueda para:{" "}
    <span className="text-red-700">{terminoBusqueda}</span>
  </h2>
)}


        {resultadosFiltrados.length === 0 ? (
          <p className="mt-6 text-gray-600">No se encontraron resultados.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {resultadosFiltrados.map((libro) => (
              <div
                key={libro.id}
                className="border rounded p-3 shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/book/${libro.isbn}`)}
              >
                <img
                  src={libro.portada}
                  alt={libro.titulo}
                  className="w-full h-60 object-contain mb-2 rounded"
                />
                <h3 className="text-sm font-semibold truncate">{libro.titulo}</h3>
                <p className="text-xs text-gray-600 truncate">{libro.autor}</p>
                <p className="text-xs text-gray-500">Categoría: {libro.categoria}</p>
                <p className="text-xs text-gray-500">Precio: ${libro.precio.toFixed(2)}</p>
                <p className="text-xs text-yellow-600">⭐ {libro.valoracion}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { SearchResults };
