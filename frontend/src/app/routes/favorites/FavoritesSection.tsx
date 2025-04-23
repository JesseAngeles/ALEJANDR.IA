import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
};

type Props = {
  libros: Libro[];
};

const Favorites: React.FC<Props> = ({ libros }) => {
  const [favoritos, setFavoritos] = useState<Libro[]>(libros);
  const navigate = useNavigate();

  const handleEliminar = (id: string) => {
    setFavoritos((prev) => prev.filter((libro) => libro.id !== id));
  };

  const handleLibroClick = (libro: Libro) => {
    alert(`Redirigir a ${libro.titulo}`);
  };

  return (
    <section className="my-8 px-6">
      {/* Botón regresar */}
      <button
        onClick={() => navigate(-1)}
        className="text-base mb-4 flex items-center gap-2"
      >
        <span className="text-xl">←</span> Regresar
      </button>

      <h2 className="text-2xl font-bold text-red-700 mb-6">Mis favoritos</h2>

      <div className="flex flex-wrap gap-4">
        {favoritos.map((libro) => (
          <div
            key={libro.id}
            className="group relative w-44 border rounded-lg shadow-sm overflow-hidden pb-2"
          >
            {/* Imagen + texto como botón */}
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

            {/* Botón para eliminar del favorito */}
            <button
              onClick={() => handleEliminar(libro.id)}
              className="absolute top-2 right-2 text-lg text-cyan-500 hover:text-cyan-700"
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

export {Favorites};
