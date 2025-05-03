// src/app/domain/services/cartService.ts
import { apiFetch } from "@/app/utils/apiFetch";
import type { Book } from "@/assets/types/book";

const API = "http://localhost:8080/cart";

export const cartService = {
    getBooksWithDetails: async (): Promise<Book[]> => {
        const response = await apiFetch(API);
        const itemList = response.items as { bookId: string; quantity: number }[];

        const books = await Promise.all(
            itemList.map(async ({ bookId, quantity }) => {
                const book = await apiFetch(`http://localhost:8080/book/${bookId}`);
                return { ...book, cantidad: quantity };
            })
        );

        return books;
    },

    addToCart: async (ISBN: string, quantity: number = 1): Promise<void> => {
        await apiFetch(`${API}/${ISBN}`, {
            method: "POST",
            body: JSON.stringify({ quantity }),
        });
    },

    removeFromCart: async (ISBN: string): Promise<void> => {
        await apiFetch(`${API}/${ISBN}`, {
            method: "DELETE",
        });
    },

    updateQuantity: async (ISBN: string, quantity: number): Promise<void> => {
        await apiFetch(`${API}/${ISBN}`, {
            method: "POST",
            body: JSON.stringify({ quantity }),
        });
    },
};
