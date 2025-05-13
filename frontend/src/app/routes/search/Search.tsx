import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchResults } from "./SearchResults";
import { searchService } from "@/app/domain/service/searchService";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  precio: number;
  valoracion: number;
  cantidad: number;
  portada: string;
  isbn: string;
};

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const filtro = searchParams.get("filtro") || null;

  const [resultados, setResultados] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarLibros = async () => {
      try {
        setLoading(true);

        const data = filtro
          ? await searchService.buscarTodos() // buscar todos y filtrar por autor/categoría
          : await searchService.buscar(query); // búsqueda directa

        setResultados(data);
      } catch (err) {
        console.error("Error al buscar:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) buscarLibros();
  }, [query, filtro]);

  const filtros = [
    { seccion: "Autor", opciones: [...new Set(resultados.map((l) => l.autor))] },
    { seccion: "Categoría", opciones: [...new Set(resultados.map((l) => l.categoria))] },
  ];

  return (
    <>
      {loading ? (
        <p className="p-6 text-gray-600">Buscando resultados...</p>
      ) : (
        <SearchResults
          terminoBusqueda={query}
          resultados={resultados}
          filtrosDisponibles={filtros}
          filtroInicial={filtro || undefined}
        />
      )}
    </>
  );
}

export { Search };
