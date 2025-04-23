import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  portada: string;
};

type Filtro = {
  seccion: string;
  opciones: string[];
};

type Props = {
  terminoBusqueda: string;
  filtrosDisponibles: Filtro[];
  resultados: Libro[];
};

const SearchResults: React.FC<Props> = ({
  terminoBusqueda,
  filtrosDisponibles,
  resultados,
}) => {
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleFiltro = (valor: string) => {
    setFiltrosActivos((prev) =>
      prev.includes(valor)
        ? prev.filter((v) => v !== valor)
        : [...prev, valor]
    );
  };

  const eliminarFiltro = (valor: string) => {
    setFiltrosActivos((prev) => prev.filter((v) => v !== valor));
  };

  const resultadosFiltrados = resultados.filter((libro) =>
    filtrosActivos.every((f) =>
      Object.values(libro).some(
        (valor) =>
          typeof valor === "string" &&
          valor.toLowerCase().includes(f.toLowerCase())
      )
    )
  );

  return (
    <div className="flex min-h-screen">
      {/* Panel de filtros */}
      <aside className="w-64 p-4 border-r text-sm">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-sm text-black hover:underline"
        >
          <span className="text-xl mr-2">←</span> Regresar
        </button>

        <h2 className="font-bold mb-2">Filtros:</h2>

        {/* Filtros activos */}
        {filtrosActivos.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filtrosActivos.map((f) => (
              <button
                key={f}
                onClick={() => eliminarFiltro(f)}
                className="flex items-center bg-cyan-100 text-sm text-cyan-900 px-2 py-1 rounded-full border border-cyan-300"
              >
                <span className="mr-1">✕</span> {f}
              </button>
            ))}
          </div>
        )}

        {/* Filtros por sección */}
        {filtrosDisponibles.map((filtro) => (
          <div key={filtro.seccion} className="mb-4">
            <h3 className="font-semibold border-b mb-1">{filtro.seccion}</h3>
            {filtro.opciones.map((opcion) => (
              <label key={opcion} className="flex items-center gap-2 my-1">
                <input
                  type="checkbox"
                  checked={filtrosActivos.includes(opcion)}
                  onChange={() => toggleFiltro(opcion)}
                />
                {opcion}
              </label>
            ))}
          </div>
        ))}
      </aside>

      {/* Resultados */}
      <main className="flex-grow p-6">
        <h2 className="text-lg font-semibold">
          Resultados de búsqueda para:{" "}
          <span className="text-red-700">{terminoBusqueda}</span>
        </h2>

        {resultadosFiltrados.length === 0 ? (
          <p className="mt-6 text-gray-600">No se encontraron resultados.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {resultadosFiltrados.map((libro) => (
              <div
                key={libro.id}
                className="border rounded p-3 shadow-sm hover:shadow-md transition"
              >
                <img
  src={libro.portada}
  alt={libro.titulo}
  className="w-full h-60 object-contain mb-2 rounded"
/>

                <h3 className="text-sm font-semibold truncate">
                  {libro.titulo}
                </h3>
                <p className="text-xs text-gray-600 truncate">{libro.autor}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { SearchResults } ;
