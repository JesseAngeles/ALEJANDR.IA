// src/app/domain/service/bookService.ts
import { tokenService } from "@/app/utils/tokenService";

const API_URL = `${import.meta.env.VITE_ENDPOINT}/book`;
const API_URL2 = `${import.meta.env.VITE_ENDPOINT}/user`;

function getAuthHeaders(): HeadersInit {
  const token = tokenService.getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token && token.split(".").length === 3) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export const bookService = {
  obtenerTodos: async () => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}`, {
      headers: getAuthHeaders(),
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
    const res = await fetch(`${API_URL}/${isbn}`);
    if (!res.ok) throw new Error("Error al obtener libro por ISBN");
    return await res.json();
  },

  obtenerUnoRecomendado: async () => {
    const res = await fetch(`${API_URL}/recommendation`);
    if (!res.ok) throw new Error("Error al obtener libro recomendado");
    return await res.json();
  },

  obtenerRecomendados: async (userId: string) => {
    console.time("Tiempo recomendación");
    const res = await fetch(`${API_URL2}/recommendations/${userId}`);
    console.timeEnd("Tiempo recomendación");

    if (!res.ok) throw new Error("Error al obtener libros recomendados");

    const data = await res.json();
    console.log("Respuesta cruda del backend:", data);
    return data.map((coleccion: any) => ({
      nombre: coleccion.name,
      libros: coleccion.books.map((libro: any) => ({
        _id: libro._id,
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
        numOpiniones: Array.isArray(libro.reviews) ? libro.reviews.length : 0,
      })),
    }));
  },

  verificarReviewUsuario: async (isbn: string) => {
    const res = await fetch(`${API_URL}/user-has-review/${isbn}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Error al verificar reseña del usuario");

    return await res.json();
  },

  crearOpinion: async (isbn: string, opinion: { rating: number; comment: string }) => {
    const res = await fetch(`${API_URL}/opinion/${isbn}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(opinion),
    });

    if (!res.ok) throw new Error("Error al crear opinión");

    return await res.json();
  },

  eliminarOpinion: async (isbn: string, reviewId: string) => {
    const res = await fetch(`${API_URL}/opinion/${isbn}/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Error al eliminar opinión");

    return await res.json();
  },

};
