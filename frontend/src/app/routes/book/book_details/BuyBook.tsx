import React from 'react';
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  enCarrito: boolean;
  onAgregarAlCarrito: () => void;
  onEliminarDelCarrito: () => void;
};

const CompraLibro: React.FC<Props> = ({ book }) => {
  const disponible = book.stock > 0;
  const navigate = useNavigate();
  const estaLogueado = !!localStorage.getItem("token"); // ✅

  const { isInCart, addToCart, removeFromCart } = useCart();
  const enCarrito = isInCart(book._id);

  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const enFavoritos = isFavorite(book._id);

  const handleToggleCarrito = async () => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

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

  const handleToggleFavorito = async () => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    try {
      if (enFavoritos) {
        await removeFromFavorites(book.ISBN);
      } else {
        await addToFavorites(book.ISBN);
      }
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
    }
  };

  const handleComprar = () => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }
    // ⚠️ Aquí podrías luego redirigir a una página de pago
    alert("Función comprar aún no implementada");
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

            <div className="flex gap-4 flex-wrap relative">
              <button
                onClick={handleComprar}
                className="mt-4 px-4 py-2 rounded-md font-semibold text-white bg-cyan-600 hover:bg-cyan-700"
              >
                Comprar
              </button>

              <button
                onClick={handleToggleCarrito}
                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${enCarrito ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
              >
                {enCarrito ? 'Eliminar del carrito' : 'Añadir al carrito'}
              </button>

              <button
                onClick={handleToggleFavorito}
                className={`mt-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-sm shadow ${
                  enFavoritos ? 'text-cyan-600' : 'text-gray-400 hover:text-cyan-600'
                }`}
                title="Favorito"
              >
                <FaHeart className="text-2xl" />
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
