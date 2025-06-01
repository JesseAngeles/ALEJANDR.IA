import React, {useEffect} from 'react';
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
 
const BookSection: React.FC<BookSectionProps> = ({ tituloSeccion = '', books}) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const { favoritos, addToFavorites, removeFromFavorites } = useFavorites();
  const { showToast } = useToast();


  const estaLogueado = !!localStorage.getItem("token");
  

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

  return (
    <section className="my-8">
      {tituloSeccion && (
        <h2 className="text-xl font-bold border-b pb-1 mb-4">{tituloSeccion}</h2>
      )}
      <div className="flex gap-4 overflow-x-auto">
        {books.filter(libro => libro.stock > 0).map((libro) => {
          const enFavoritos = favoritos.some(fav => fav.ISBN === libro.ISBN);
          const enCarrito = cart.some(item => {
            const esIgual = item.bookId === libro._id;
            console.log("🔍 Comparando:", item.bookId, "===", libro._id, "→", esIgual);
            return esIgual;
          });





          const toggleFavorito = async () => {
            if (!estaLogueado) {
              navigate("/login");
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
            if (!estaLogueado) return navigate("/login");

            try {
              if (!enCarrito) {
                await addToCart(libro.ISBN);
                showToast("Libro añadido a carrito", "success");

              } else {
                await removeFromCart(libro.ISBN);
                showToast(`Libro eliminado del carrito`, "error");
              }
              
              
              // No necesitas setActualizador aquí
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
                className={`absolute top-2 right-2 text-lg ${enFavoritos ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500'
                  }`}
                title="Favorito"
              >
                <FaHeart />
              </button>

              <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={handleToggleCarrito}
                  className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${enCarrito ? 'bg-red-600' : 'bg-cyan-600'
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
