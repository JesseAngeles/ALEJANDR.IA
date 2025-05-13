import React, { useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";

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

interface BookSectionProps {
  tituloSeccion?: string;
  books: Book[];
}

const BookSection: React.FC<BookSectionProps> = ({ tituloSeccion = '', books }) => {
  const navigate = useNavigate();
  const { isInCart, addToCart, removeFromCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const estaLogueado = !!localStorage.getItem("token");
  const [actualizador, setActualizador] = useState(0); // 🔁 Forzar re-render visual

  const handleLibroClick = (libro: Book) => {
    navigate(`/book/${libro.ISBN}`);
  };

  const toggleFavorito = async (libro: Book) => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite(libro._id)) {
        await removeFromFavorites(libro.ISBN);
      } else {
        await addToFavorites(libro.ISBN);
      }
      setActualizador(prev => prev + 1); // 🔁 Forzar re-render visual
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
    }
  };

  const handleToggleCarrito = async (libro: Book) => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    try {
      if (isInCart(libro._id)) {
        await removeFromCart(libro.ISBN);
      } else {
        await addToCart(libro.ISBN);
      }
      setActualizador(prev => prev + 1); // 🔁 Forzar re-render visual
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };

  return (
    <section className="my-8">
      {tituloSeccion && (
        <h2 className="text-xl font-bold border-b pb-1 mb-4">{tituloSeccion}</h2>
      )}
      <div className="flex gap-4 overflow-x-auto">
        {books.map((libro) => {
          const enFavoritos = isFavorite(libro._id);
          const enCarrito = isInCart(libro._id);

          return (
            <div
              key={`${libro._id}-${actualizador}`} // 🔁 fuerza re-render al cambiar
              className="group relative w-44 flex-shrink-0 border rounded-lg shadow-sm overflow-hidden pb-12"
            >
              <button onClick={() => handleLibroClick(libro)} className="w-full text-left">
                <img src={libro.image} alt={libro.title} className="w-full h-60 object-cover" />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{libro.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{libro.author}</p>
                  <p className="text-sm font-medium mt-1">${libro.price.toFixed(2)}</p>
                </div>
              </button>

              <button
                onClick={() => toggleFavorito(libro)}
                className={`absolute top-2 right-2 text-lg ${
                  enFavoritos ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500'
                }`}
                title="Favorito"
              >
                <FaHeart />
              </button>

              <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleToggleCarrito(libro)}
                  className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${
                    enCarrito ? 'bg-red-600' : 'bg-cyan-600'
                  }`}
                >
                  {enCarrito ? 'Eliminar del carrito' : 'Añadir al carrito'}
                  <FaShoppingCart className="ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BookSection;
