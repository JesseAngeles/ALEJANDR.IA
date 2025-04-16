import React, { useState } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

const librosIniciales: Libro[] = [
  {
    id: 1,
    titulo: "ALAS DE ÓNIX",
    autor: "REBECCA YARROS",
    precio: 569,
    imagen: "/alas-onix.jpg",
    cantidad: 1,
  },
  {
    id: 2,
    titulo: "FRANCO",
    autor: "PAUL PRESTON",
    precio: 569,
    imagen: "/franco.jpg",
    cantidad: 1,
  },
  {
    id: 3,
    titulo: "CUCHARA Y MEMORIA",
    autor: "BENITO TAIBO",
    precio: 569,
    imagen: "/cuchara-memoria.jpg",
    cantidad: 1,
  },
];

const ShoppingCart: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>(librosIniciales);

  const cambiarCantidad = (id: number, cambio: number) => {
    setLibros((prev) =>
      prev.map((libro) =>
        libro.id === id
          ? { ...libro, cantidad: Math.max(1, libro.cantidad + cambio) }
          : libro
      )
    );
  };

  const eliminarLibro = (id: number) => {
    setLibros((prev) => prev.filter((libro) => libro.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-white bg-[#820000] text-center py-3 text-xl font-bold rounded-t">
        Mi carrito
      </h1>

      <div className="bg-white rounded-b overflow-hidden shadow">
        <div className="grid grid-cols-5 text-center font-semibold border-b p-4">
          <div className="col-span-2 text-left">Producto</div>
          <div>Precio</div>
          <div>Cantidad</div>
          <div>Subtotal</div>
        </div>

        {libros.map((libro) => (
          <div
            key={libro.id}
            className="grid grid-cols-5 items-center gap-4 text-sm border-b p-4"
          >
            {/* Eliminar + Producto */}
            <div className="col-span-2 flex items-center gap-4">
              <button
                onClick={() => eliminarLibro(libro.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="w-12 h-16 object-cover"
              />
              <div>
                <p className="font-semibold">{libro.titulo}</p>
                <p className="text-xs text-gray-500">{libro.autor}</p>
              </div>
            </div>

            {/* Precio */}
            <div className="text-center font-medium">
              ${libro.precio.toFixed(2)}
            </div>

            {/* Cantidad */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => cambiarCantidad(libro.id, -1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaMinus className="text-xs" />
              </button>
              <span>{libro.cantidad}</span>
              <button
                onClick={() => cambiarCantidad(libro.id, 1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-[#007B83] font-semibold text-center">
              ${(libro.precio * libro.cantidad).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export {ShoppingCart};