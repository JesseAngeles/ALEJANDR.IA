// src/app/domain/service/bookService.ts
import { tokenService } from "@/app/utils/tokenService";

export const bookService = {
  obtenerTodos: async () => {
    const token = tokenService.getToken();
    const res = await fetch("http://localhost:8080/book", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al obtener libros");

    const data = await res.json();
    return data.map((libro: any) => ({
        id: libro._id,
        title: libro.title,
        author: Array.isArray(libro.author) ? libro.author.join(", ") : libro.author,
        image: libro.image,
        category: libro.category || "Sin categoría",
        price: typeof libro.price === "number" ? libro.price : 0,
        rating: typeof libro.rating === "number" ? libro.rating : 0,
        stock: typeof libro.stock === "number" ? libro.stock : 0,
        ISBN: libro.ISBN || "",
        sinopsis: libro.sinopsis || "",
        reviews: libro.reviews || [],
        reviewSumary: libro.reviewSumary || "",
      }));
      
  },

  obtenerPorISBN: async (isbn: string) => {
    const res = await fetch(`http://localhost:8080/book/${isbn}`);
    if (!res.ok) throw new Error("Error al obtener libro por ISBN");

    return await res.json();
  },

  obtenerUnoRecomendado: async () => {
    const res = await fetch("http://localhost:8080/book/9780547739465"); // Este es fijo, puedes cambiarlo
    if (!res.ok) throw new Error("Error al obtener libro recomendado");
    return await res.json();
  },

  obtenerRecomendados: async () => {
    const res = await fetch("http://localhost:8080/book/recommended");

    if (!res.ok) throw new Error("Error al obtener libros recomendados");

    const data = await res.json();
    // data es un array con objetos tipo { name: string, books: Book[] }
    return data.map((coleccion: any) => ({
      nombre: coleccion.name,
      libros: coleccion.books.map((libro: any) => ({
        id: libro._id,
        title: libro.title,
        author: Array.isArray(libro.author) ? libro.author.join(", ") : libro.author,
        image: libro.image,
        category: libro.category || "Sin categoría",
        price: typeof libro.price === "number" ? libro.price : 0,
        rating: typeof libro.rating === "number" ? libro.rating : 0,
        stock: typeof libro.stock === "number" ? libro.stock : 0,
        ISBN: libro.ISBN || "",
        sinopsis: libro.sinopsis || "",
        reviews: libro.reviews || [],
        reviewSumary: libro.reviewSumary || "",
      })),
    }));
  },
};
