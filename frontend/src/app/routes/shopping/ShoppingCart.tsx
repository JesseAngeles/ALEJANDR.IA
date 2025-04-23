import React, { useState } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { Book } from "@/assets/types/book";
import { initialBooks } from "@/assets/data/books_cart";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { useNavigate } from "react-router-dom";

const ShoppingCart: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const { setPurchase } = usePurchase();
  const navigate = useNavigate();

  const updateQuantity = (id: number, change: number) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id
          ? { ...book, cantidad: Math.max(1, book.cantidad + change) }
          : book
      )
    );
  };

  const removeBook = (id: number) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const totalItems = books.reduce((acc, book) => acc + book.cantidad, 0);
  const subtotal = books.reduce((acc, book) => acc + book.precio * book.cantidad, 0);

  const proceedToCheckout = () => {
    setPurchase((prev) => ({ ...prev, carrito: books }));
    navigate("/address");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-white bg-[#820000] text-center py-3 text-xl font-bold rounded-t">
        Shopping Cart
      </h1>

      {/* Cart Table */}
      <div className="bg-white rounded-b overflow-hidden shadow">
        <div className="grid grid-cols-5 text-center font-semibold border-b p-4">
          <div className="col-span-2 text-left">Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
        </div>

        {books.map((book) => (
          <div
            key={book.id}
            className="grid grid-cols-5 items-center gap-4 text-sm border-b p-4"
          >
            {/* Product */}
            <div className="col-span-2 flex items-center gap-4">
              <button
                onClick={() => removeBook(book.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
              <img
                src={book.imagen}
                alt={book.titulo}
                className="w-12 h-16 object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{book.titulo}</p>
                <p className="text-xs text-gray-500">{book.autor}</p>
              </div>
            </div>

            {/* Price */}
            <div className="text-center font-medium">
              ${book.precio.toFixed(2)}
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => updateQuantity(book.id, -1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="w-4 text-center">{book.cantidad}</span>
              <button
                onClick={() => updateQuantity(book.id, 1)}
                className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-[#007B83] font-semibold text-center">
              ${(book.precio * book.cantidad).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex justify-end mt-6">
        <div className="border rounded w-full max-w-sm p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-semibold">Total items:</span>
            <span className="text-[#007B83]">{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="font-semibold">Subtotal:</span>
            <span className="text-[#007B83] font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <hr className="mb-4" />
          <button
            onClick={proceedToCheckout}
            className="w-full bg-[#007B83] text-white py-2 rounded hover:bg-[#00666e] transition"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export { ShoppingCart };
