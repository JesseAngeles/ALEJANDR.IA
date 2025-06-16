import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { useToast } from '@/app/domain/context/ToastContext';
import { bookService } from '@/app/domain/service/bookService';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
  ISBN: string;
  stock?: number;
};

type Props = {
  libros: Libro[];
};

const Favorites: React.FC<Props> = ({ libros }) => {
  const navigate = useNavigate();
  const { removeFromFavorites } = useFavorites();
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();
  const [librosActuales, setLibrosActuales] = useState<Libro[]>(libros);
  const [eliminados, setEliminados] = useState<{
    libro: Libro;
    countdown: number;
    intervalId: NodeJS.Timeout;
    timeoutId: NodeJS.Timeout;
  }[]>([]);
  const [contador, setContador] = useState(5);
  const { showToast } = useToast();
  const [stockFetched, setStockFetched] = useState<{ [isbn: string]: number }>({});

  const handleEliminar = async (libro: Libro) => {
    setLibrosActuales(prev => prev.filter(l => l.id !== libro.id));
    let countdown = 5;

    const intervalId = setInterval(() => {
      setEliminados(prev =>
        prev.map(e =>
          e.libro.id === libro.id ? { ...e, countdown: e.countdown - 1 } : e
        )
      );
    }, 1000);

    const timeoutId = setTimeout(async () => {
      await removeFromFavorites(libro.ISBN);
      clearInterval(intervalId);
      setEliminados(prev => prev.filter(e => e.libro.id !== libro.id));
    }, 5000);

    setEliminados(prev => [
      ...prev,
      { libro, countdown, intervalId, timeoutId },
    ]);
  };

  const handleDeshacer = (id: string) => {
    const eliminado = eliminados.find(e => e.libro.id === id);
    if (!eliminado) return;

    clearInterval(eliminado.intervalId);
    clearTimeout(eliminado.timeoutId);

    setLibrosActuales(prev => [eliminado.libro, ...prev]);
    setEliminados(prev => prev.filter(e => e.libro.id !== id));
  };

  // Fetch stock for each book
  useEffect(() => {
    libros.forEach(libro => {
      fetchBookStock(libro.ISBN);
    });
  }, [libros]);

  const fetchBookStock = async (isbn: string) => {
    try {
      const book = await bookService.obtenerPorISBN(isbn);
      setStockFetched(prev => ({ ...prev, [isbn]: book.stock }));
    } catch (error) {
      console.error("Error al obtener el stock del libro", error);
    }
  };

  const handleLibroClick = (libro: Libro) => {
    navigate(`/book/${libro.ISBN}`);
  };

  const handleToggleCarrito = async (libro: Libro, enCarrito: boolean) => {
    try {
      if (!enCarrito) {
        await addToCart(libro.ISBN);
        showToast("Libro añadido al carrito", "success");
      } else {
        await removeFromCart(libro.ISBN);
        showToast("Libro eliminado del carrito", "error");
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };

  return (
    <section className="my-8 px-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
      </button>

      <h2 className="text-2xl font-bold text-red-700 mb-4">Mis favoritos</h2>

      {eliminados.map(e => (
        <div
          key={e.libro.id}
          className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
        >
          <p className="text-sm italic">
            Se eliminó <strong>{e.libro.titulo}</strong>
            <br />
            <span className="text-xs text-gray-600">Tiempo restante: {e.countdown} segundos</span>
          </p>
          <button
            onClick={() => handleDeshacer(e.libro.id)}
            className="text-sm text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded"
          >
            Deshacer
          </button>
        </div>
      ))}

      {librosActuales.length === 0 && eliminados.length === 0 && (
        <p className="text-center text-gray-500 italic mt-8">
          Aún no has añadido ningún libro a favoritos.
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        {librosActuales.map((libro) => {
          const enCarrito = cart.some(item => item.bookId === libro.id);
          const stock = stockFetched[libro.ISBN] || 0; // obtiene el stock

          return (
            <div
              key={libro.id}
              className="group relative w-44 border rounded-lg shadow-sm overflow-hidden pb-7"
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
              <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleToggleCarrito(libro, enCarrito)}
                  className={`text-white text-xs px-3 py-1 rounded-md flex items-center ${enCarrito ? 'bg-red-600 hover:bg-red-700' : (stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700')}`}
                  disabled={stock === 0} // Deshabilitar si no hay stock
                >
                  {enCarrito ? 'Eliminar del carrito' : (stock === 0 ? 'No disponible' : 'Añadir al carrito')}
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

export { Favorites };
