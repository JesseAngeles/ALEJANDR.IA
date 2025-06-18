import React, { useEffect, useState } from 'react';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { useLocation } from 'react-router-dom'; 
import { useToast } from '@/app/domain/context/ToastContext';

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
  numOpiniones: number;
}

interface BookSectionProps {
  tituloSeccion?: string;
  books: Book[];
}

const BookSection: React.FC<BookSectionProps> = ({ tituloSeccion = '', books }) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const { favoritos, addToFavorites, removeFromFavorites } = useFavorites();
  const { showToast } = useToast();

  const estaLogueado = !!localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [actionType, setActionType] = useState<'cart' | 'favorites' | null>(null); // Tipo de acción

  const renderStars = (rating: number) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`text-xs ${i < rounded ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const location = useLocation(); 
  useEffect(() => {
    fetchCart(); 
  }, [location]);

  const handleLibroClick = (libro: Book) => {
    navigate(`/book/${libro.ISBN}`);
  };


    // Función para manejar la respuesta del modal
    const handleModalResponse = (response: boolean) => {
      if (response) {
        // Redirigir a la página de login si el usuario no está logueado
        navigate("/login");
      }
      setShowModal(false);
    };
  
    // Función para abrir el modal y establecer la acción
    const openModal = (type: 'cart' | 'favorites') => {
      setActionType(type);
      setShowModal(true);
    };

  return (
    <section className="my-8">
      {tituloSeccion && (
        <h2 className="text-xl font-bold border-b pb-1 mb-4">{tituloSeccion}</h2>
      )}
      <div className="flex gap-4 overflow-x-auto">
        {books.map((libro) => {
          const enFavoritos = favoritos.some(fav => fav.ISBN === libro.ISBN);
          const enCarrito = cart.some(item => item.bookId === libro._id);

          const toggleFavorito = async () => {
            if (!estaLogueado) {
              openModal('favorites');
              return;
            }

            try {
              if (!enFavoritos) {
                await addToFavorites(libro.ISBN);
                showToast("Libro añadido a favoritos", "success");
              } else {
                await removeFromFavorites(libro.ISBN);
                showToast("Libro eliminado de favoritos", "error");
              }
            } catch (error) {
              console.error("Error al modificar favoritos:", error);
            }
          };

          const handleToggleCarrito = async () => {
            if (!estaLogueado) {
              openModal('cart');
              return;
            }

            try {
              if (libro.stock <1) {
                showToast("No hay stock disponible", "error");
                return; // No agregar al carrito si no hay stock
              }

              if (!enCarrito) {
                await addToCart(libro.ISBN);
                showToast("Libro añadido a carrito", "success");
              } else {
                await removeFromCart(libro.ISBN);
                showToast(`Libro eliminado del carrito`, "error");
              }
            } catch (error) {
              console.error("Error al modificar el carrito:", error);
            }
          };

          return (
            <div
              key={libro._id}
              className="group relative w-44 flex-shrink-0 border rounded-lg shadow-sm overflow-hidden pb-7"
            >
              <button onClick={() => handleLibroClick(libro)} className="w-full text-left">
                <img src={libro.image} alt={libro.title} className="w-full h-60 object-cover" />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{libro.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{libro.author}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-700 font-medium">
                      {libro.rating.toFixed(1)}
                    </span>
                    {renderStars(libro.rating)}

                    <span className="text-xs text-gray-500">
                      ({libro.numOpiniones})
                    </span>
                  </div>

                  <p className="text-sm font-medium mt-1">${libro.price.toFixed(2)}</p>
                </div>
              </button>

              <button
                onClick={toggleFavorito}
                className={`absolute top-2 right-2 text-lg ${enFavoritos ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500'}`}
                title="Favorito"
              >
                <FaHeart />
              </button>

              <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={handleToggleCarrito}
                  disabled={libro.stock <= 0} // Deshabilitar si no hay stock
                  className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${enCarrito ? 'bg-red-600' : 'bg-cyan-600'} ${libro.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                >
                  {enCarrito ? 'Eliminar del carrito' : libro.stock > 0 ? 'Añadir al carrito' : 'No disponible'}
                  <FaShoppingCart className="ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Deseas iniciar sesión para continuar?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleModalResponse(true)} // Confirmar
                className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
              >
                Sí
              </button>
              <button
                onClick={() => handleModalResponse(false)} // Cancelar
                className="bg-[#f44336] text-white px-4 py-2 rounded hover:bg-[#d32f2f]"
              >
                No
              </button>
            </div>
          </div>
        </div>
        )}
    </section>
  );
};

export default BookSection;
