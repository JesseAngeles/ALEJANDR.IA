import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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

interface BookSectionProps {
  tituloSeccion?: string;
  books: Book[];
}

const BookSection: React.FC<BookSectionProps> = ({ tituloSeccion = '', books }) => {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLibroClick = (libro: Book) => {
    navigate(`/book/${libro.ISBN}`);
  };

  const { cart, isInCart, addToCart, removeFromCart } = useCart();


  const handleToggleCarrito = async (libro: Book) => {
    const id = libro._id; // 👈 usar el _id del libro
    try {
      if (isInCart(id)) {
        await removeFromCart(libro.ISBN);
      } else {
        await addToCart(libro.ISBN);
      }
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
        {books.map((libro) => (
          <div
            key={libro._id}
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
              onClick={() => toggleFavorito(libro._id)}
              className={`absolute top-2 right-2 text-lg ${
                favoritos.includes(libro._id)
                  ? 'text-cyan-500'
                  : 'text-gray-400 hover:text-cyan-500'
              }`}
            >
              <FaHeart />
            </button>

            <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
            <button
  onClick={() => handleToggleCarrito(libro)}
  className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${
    isInCart(libro._id) ? 'bg-red-600' : 'bg-cyan-600'
  }`}
>
  {isInCart(libro._id) ? 'Eliminar del carrito' : 'Añadir al carrito'}
  <FaShoppingCart className="ml-2" />
</button>


            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookSection;
