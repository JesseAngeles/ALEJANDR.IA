import React from 'react';
import { useCart } from "@/app/domain/context/CartContext";

interface Book {
  _id: string;
  title: string;
  image: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  ISBN: string;
  sinopsis: string;
}

type Props = {
  book: Book;
};

const CompraLibro: React.FC<Props> = ({ book }) => {
  const disponible = book.stock > 0;
  const { isInCart, addToCart, removeFromCart } = useCart();
  const enCarrito = isInCart(book._id); // directamente del contexto

  const handleToggleCarrito = async () => {
    try {
      if (enCarrito) {
        await removeFromCart(book.ISBN);
      } else {
        await addToCart(book.ISBN);
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
      alert("Hubo un problema al actualizar el carrito.");
    }
  };

  return (
    <div className="px-6 py-10">
      <button
        onClick={() => window.history.back()}
        className="text-base mb-6 flex items-center gap-2"
      >
        <span className="text-2xl">←</span> Regresar
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <img src={book.image} alt={book.title} className="w-60 h-auto rounded shadow-xl" />

          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-red-800">{book.title}</h2>
            <p className="text-lg uppercase tracking-wide">{book.author}</p>

            <div className="text-2xl font-semibold">
              <span className="text-cyan-700">${book.price.toFixed(2)}</span>
            </div>

            <p className={`text-lg ${disponible ? 'text-green-600' : 'text-red-600'}`}>
              {disponible ? 'Disponible' : 'No disponible'}
            </p>

            {enCarrito && (
              <p className="text-sm text-gray-700 italic">Libro agregado al carrito</p>
            )}

            <div className="flex gap-4 flex-wrap">
              <button className="bg-cyan-700 text-white px-6 py-2 text-base rounded hover:bg-cyan-800 transition">
                Comprar
              </button>
              <button
                onClick={handleToggleCarrito}
                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${
                  enCarrito ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {enCarrito ? 'Eliminar del carrito' : 'Añadir al carrito'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-red-800 mb-2">SINOPSIS</h3>
          <hr className="border-t border-gray-300 mb-4" />
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {book.sinopsis}
          </p>
        </div>
      </div>
    </div>
  );
};

export { CompraLibro };
