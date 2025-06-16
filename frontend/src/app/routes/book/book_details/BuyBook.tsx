import React, { useEffect } from 'react';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from "@/app/domain/context/CartContext";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { useToast } from '@/app/domain/context/ToastContext';
import { usePurchase } from '@/app/domain/context/PurchaseContext';
import { cartService } from '@/app/domain/service/cartService';
import { useCartBackup } from '@/app/domain/context/CartBackupContext';

interface Book {
  _id: string;
  title: string;
  image: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  stock: number; // stock property to check availability
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
  const estaLogueado = !!localStorage.getItem("token");
  const { showToast } = useToast();
  const { isInCart, addToCart, removeFromCart, fetchCart } = useCart();
  const enCarrito = isInCart(book._id);
  const { setPurchase } = usePurchase();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const enFavoritos = isFavorite(book._id);
  const { setBackup } = useCartBackup();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleToggleCarrito = async () => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    try {
      if (enCarrito) {
        await removeFromCart(book.ISBN);
        showToast("Libro eliminado del carrito", "error");
      } else {
        await addToCart(book.ISBN);
        showToast("Libro añadido al carrito", "success");
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
      showToast("Hubo un error al actualizar el carrito", "error");
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
        showToast("Libro eliminado de favoritos", "error");
      } else {
        await addToFavorites(book.ISBN);
        showToast("Libro añadido a favoritos", "success");
      }
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
      showToast("Hubo un error al actualizar favoritos", "error");
    }
  };

  const handleComprar = async () => {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    const libroConCantidad = {
      id: book._id,
      titulo: book.title,
      autor: book.author,
      precio: book.price,
      imagen: book.image,
      cantidad: 1,
      ISBN: book.ISBN,
      stock: book.stock,
    };

    try {
      const currentCart = await cartService.getCart();

      const backupItems: { isbn: string; quantity: number }[] = await Promise.all(
        currentCart.items.map(async (item: { bookId: string; quantity: number }) => {
          const libro = await cartService.getBookById(item.bookId);
          return {
            isbn: libro.ISBN,
            quantity: item.quantity,
          };
        })
      );
      setBackup(backupItems);

      await cartService.emptyCart();
      await cartService.addToCart(book.ISBN, 1);

      setPurchase((prev) => ({
        ...prev,
        cart: [libroConCantidad],
      }));

      navigate("/address");
    } catch (error) {
      console.error("❌ Error durante la preparación de la compra:", error);
      showToast("Error al preparar la compra", "error");
    }
  };

  return (
    <div className="px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
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

            <p className={`text-lg ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {book.stock === 0
                ? 'No disponible'
                : book.stock === 1
                ? '1 disponible'
                : `${book.stock} disponibles`}
            </p>

            {enCarrito && (
              <p className="text-sm text-gray-700 italic">Libro agregado al carrito</p>
            )}

            <div className="flex gap-4 flex-wrap relative">
              <button
                onClick={handleComprar}
                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${book.stock > 0 ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={book.stock === 0} // Deshabilitar el botón si no hay stock
              >
                Comprar
              </button>

              <button
                onClick={handleToggleCarrito}
                className={`mt-4 px-4 py-2 rounded-md font-semibold text-white ${enCarrito || book.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                disabled={book.stock === 0} // Deshabilitar el botón si no hay stock
              >
                {enCarrito ? 'Eliminar del carrito' : book.stock === 0 ? 'No disponible' : 'Añadir al carrito'}
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

        {book.sinopsis && book.sinopsis.trim() !== '' && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-red-800 mb-2">SINOPSIS</h3>
            <hr className="border-t border-gray-300 mb-4" />
            <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
              {book.sinopsis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { CompraLibro };
