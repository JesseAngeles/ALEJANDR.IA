import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { useNavigate } from "react-router-dom";
import type { Book } from "@/assets/types/book";
import { cartService } from "@/app/domain/service/cartService";

const ShoppingCart: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [recentlyRemoved, setRecentlyRemoved] = useState<Book | null>(null);
  const [undoCountdown, setUndoCountdown] = useState<number>(0);
  const [undoInterval, setUndoInterval] = useState<NodeJS.Timeout | null>(null);
  const { setPurchase } = usePurchase();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const libros = await cartService.getBooksWithDetails();
    setBooks(libros);
  };

  const handleRemove = async (book: Book) => {
    await cartService.removeFromCart(book.ISBN);
    setBooks((prev) => prev.filter((b) => b.ISBN !== book.ISBN));
    setRecentlyRemoved(book);
    setUndoCountdown(3);

    if (undoInterval) clearInterval(undoInterval);

    const interval = setInterval(() => {
      setUndoCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRecentlyRemoved(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setUndoInterval(interval);
  };

  const handleUndo = async () => {
    if (recentlyRemoved) {
      await cartService.addToCart(recentlyRemoved.ISBN, recentlyRemoved.cantidad);
      await loadCart();
      setRecentlyRemoved(null);
      setUndoCountdown(0);
      if (undoInterval) clearInterval(undoInterval);
    }
  };

  const updateQuantity = async (isbn: string, change: number) => {
    const target = books.find((b) => b.ISBN === isbn);
    if (!target) return;

    const newQty = target.cantidad + change;
    if (newQty <= 0) {
      await handleRemove(target);
    } else {
      await cartService.addToCart(isbn, newQty);
      await loadCart();
    }
  };

  const totalItems = books.reduce((acc, book) => acc + book.cantidad, 0);
  const subtotal = books.reduce((acc, book) => acc + book.precio * book.cantidad, 0);

  const proceedToCheckout = () => {
    setPurchase((prev) => ({ ...prev, cart: books }));
    navigate("/address");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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

        {recentlyRemoved && (
          <div className="grid grid-cols-5 items-center border-b p-4 text-sm text-center bg-gray-50">
            <div className="col-span-3 text-left text-gray-700 font-semibold">
              Producto eliminado...
              <div className="text-xs font-normal text-gray-500">
                Tiempo restante: {undoCountdown} segundos
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={handleUndo}
                className="bg-[#007B83] hover:bg-[#00666e] text-white text-sm px-4 py-2 rounded"
              >
                Deshacer
              </button>
            </div>
          </div>
        )}

        {books.map((book) => (
          <div
            key={book.ISBN}
            className="grid grid-cols-5 items-center gap-4 text-sm border-b p-4"
          >
            <div className="col-span-2 flex items-center gap-4">
              <button
                onClick={() => handleRemove(book)}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
              <img src={book.imagen} alt={book.titulo} className="w-12 h-16 object-cover" />
              <div>
                <p className="font-semibold text-sm">{book.titulo}</p>
                <p className="text-xs text-gray-500">{book.autor}</p>
              </div>
            </div>

            <div className="text-center font-medium">${book.precio.toFixed(2)}</div>

            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => updateQuantity(book.ISBN, -1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="w-4 text-center">{book.cantidad}</span>
              <button
                onClick={() => updateQuantity(book.ISBN, 1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            <div className="text-[#007B83] font-semibold text-center">
              ${(book.precio * book.cantidad).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <div className="border rounded w-full max-w-sm p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-semibold">Total de productos:</span>
            <span className="text-[#007B83]">{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="font-semibold">Subtotal de compra:</span>
            <span className="text-[#007B83] font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <hr className="mb-4" />
          <button
            onClick={proceedToCheckout}
            className="w-full bg-[#007B83] text-white py-2 rounded hover:bg-[#00666e] transition"
          >
            Realizar el pago
          </button>
        </div>
      </div>
    </div>
  );
};

export { ShoppingCart };
