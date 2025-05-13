import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from "@/app/domain/context/FavoritesContext";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
  ISBN: string;
};

type Props = {
  libros: Libro[];
};

const Favorites: React.FC<Props> = ({ libros }) => {
  const navigate = useNavigate();
  const { removeFromFavorites } = useFavorites();

  const [librosActuales, setLibrosActuales] = useState<Libro[]>(libros);
  const [eliminado, setEliminado] = useState<Libro | null>(null);
  const [contador, setContador] = useState(5);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleEliminar = async (libro: Libro) => {
    setLibrosActuales(prev => prev.filter(l => l.id !== libro.id));
    setEliminado(libro);
    setContador(5);

    const timer = setTimeout(async () => {
      await removeFromFavorites(libro.ISBN);
      setEliminado(null);
    }, 5000);
    setUndoTimer(timer);

    const interval = setInterval(() => {
      setContador(prev => prev - 1);
    }, 1000);
    setIntervalId(interval);
  };

  const handleDeshacer = () => {
    if (eliminado) {
      setLibrosActuales(prev => [eliminado!, ...prev]);
      if (undoTimer) clearTimeout(undoTimer);
      if (intervalId) clearInterval(intervalId);
      setEliminado(null);
    }
  };

  // Limpiar intervalo al desaparecer el mensaje
  useEffect(() => {
    if (contador === 0 && intervalId) {
      clearInterval(intervalId);
    }
  }, [contador, intervalId]);

  const handleLibroClick = (libro: Libro) => {
    navigate(`/book/${libro.ISBN}`); // ← antes usabas `libro.id`
  };
  
  return (
    <section className="my-8 px-6">
      <button
        onClick={() => navigate(-1)}
        className="text-base mb-4 flex items-center gap-2"
      >
        <span className="text-xl">←</span> Regresar
      </button>

      <h2 className="text-2xl font-bold text-red-700 mb-4">Mis favoritos</h2>

      {eliminado && (
        <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <p className="text-sm italic">
            Se eliminó <strong>{eliminado.titulo}</strong>
            <br />
            <span className="text-xs text-gray-600">Tiempo restante: {contador} segundos</span>
          </p>
          <button
            onClick={handleDeshacer}
            className="text-sm text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded"
          >
            Deshacer
          </button>
        </div>
      )}

{librosActuales.length === 0 && !eliminado && (
  <p className="text-center text-gray-500 italic mt-8">
    Aún no has añadido ningún libro a favoritos.
  </p>
)}


      <div className="flex flex-wrap gap-4">
        {librosActuales.map((libro) => (
          <div
            key={libro.id}
            className="group relative w-44 border rounded-lg shadow-sm overflow-hidden pb-2"
          >
            <button
              onClick={() => handleLibroClick(libro)}
              className="w-full text-left"
            >
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="w-full h-60 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{libro.titulo}</h3>
                <p className="text-xs text-gray-500 truncate">{libro.autor}</p>
                <p className="text-sm font-medium mt-1">${libro.precio.toFixed(2)}</p>
              </div>
            </button>

            <button
              onClick={() => handleEliminar(libro)}
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow text-cyan-500 hover:text-cyan-700"
              title="Eliminar de favoritos"
            >
              <FaHeart />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Favorites };
