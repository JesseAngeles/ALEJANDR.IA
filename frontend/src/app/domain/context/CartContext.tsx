import React, { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "@/app/domain/service/cartService";

interface CartItem {
  bookId: string;
  quantity: number;
}



interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  isInCart: (bookId: string) => boolean;
  addToCart: (isbn: string) => Promise<void>;
  removeFromCart: (isbn: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.items);
    } catch (err) {
      console.error("Error fetching cart", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const isInCart = (bookObjectId: string) => {
    return cart.some(item => item.bookId === bookObjectId);
  };



  const addToCart = async (isbn: string) => {
    await cartService.addToCart(isbn);
    await fetchCart(); // esto ya está bien
  };

  const removeFromCart = async (isbn: string) => {
    await cartService.removeFromCart(isbn);
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, isInCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
