import React, { useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
};

type Props = {
  tituloSeccion?: string;
  libros: Libro[];
};

const BookSection: React.FC<Props> = ({ tituloSeccion = '', libros }) => {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLibroClick = (libro: Libro) => {
    // Aquí defines la acción al hacer clic en el libro (redirigir, abrir modal, etc.)
    alert(`Haz hecho clic en: ${libro.titulo}`);
  };

  return (
    <section className="my-8">
      {tituloSeccion && (
        <h2 className="text-xl font-bold border-b pb-1 mb-4">{tituloSeccion}</h2>
      )}
      <div className="flex gap-4 overflow-x-auto">
        {libros.map((libro) => (
          <div
            key={libro.id}
            className="group relative w-44 flex-shrink-0 border rounded-lg shadow-sm overflow-hidden pb-12"
          >
            {/* Imagen + texto como botón */}
            <button
              onClick={() => handleLibroClick(libro)}
              className="w-full text-left"
            >
              <img src={libro.imagen} alt={libro.titulo} className="w-full h-60 object-cover" />
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{libro.titulo}</h3>
                <p className="text-xs text-gray-500 truncate">{libro.autor}</p>
                <p className="text-sm font-medium mt-1">${libro.precio.toFixed(2)}</p>
              </div>
            </button>

            {/* Botón de favorito */}
            <button
              onClick={() => toggleFavorito(libro.id)}
              className={`absolute top-2 right-2 text-lg ${
                favoritos.includes(libro.id)
                  ? 'text-cyan-500'
                  : 'text-gray-400 hover:text-cyan-500'
              }`}
            >
              <FaHeart />
            </button>

            {/* Botón de carrito corregido (fuera del área de contenido) */}
            <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
              <button className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-md flex items-center">
                Añadir al carrito <FaShoppingCart className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookSection;
