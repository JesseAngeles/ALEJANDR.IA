// src/app/domain/service/searchService.ts
import { tokenService } from "@/app/utils/tokenService";

const API_URL = `${import.meta.env.VITE_ENDPOINT}`;

export const searchService = {

  buscarTodos: async () => {
    const token = tokenService.getToken();

const headers: any = {
  "Content-Type": "application/json",
};

try {
  const tokenParts = token?.split(".") || [];
  if (tokenParts.length === 3) {
    JSON.parse(atob(tokenParts[1])); // Intenta parsear el payload
    headers.Authorization = `Bearer ${token}`;
  }
} catch (e) {
  console.warn("[BUSCAR TODOS] Token inválido, no se usará:", token);
}


const res = await fetch(`${API_URL}/book`, {
  headers,
});

  
    if (!res.ok) throw new Error("Error al obtener libros");
  
    const librosRaw = await res.json();
    return librosRaw.map((libro: any) => ({
      id: libro._id,
      titulo: libro.title,
      autor: Array.isArray(libro.author) ? libro.author.join(", ") : libro.author,
      portada: libro.image,
      categoria: libro.category || "Sin categoría",
      precio: libro.price || 0,
      valoracion: libro.rating || 0,
      cantidad: libro.stock || 0,
      isbn: libro.ISBN,
      numOpiniones: Array.isArray(libro.reviews) ? libro.reviews.length : 0,
      stock: typeof libro.stock === "number" ? libro.stock : 0,
    }));
  },
 
  buscar: async (termino: string) => {
    const token = tokenService.getToken();

const headers: any = {
  "Content-Type": "application/json",
};

if (token && token.split(".").length === 3) {
  headers.Authorization = `Bearer ${token}`;
}

const res = await fetch(`${API_URL}/search`, {
  method: "POST",
  headers,
  body: JSON.stringify({ query: termino }),
});


    if (!res.ok) throw new Error("Error al buscar libros");

    const librosRaw = await res.json();
    return librosRaw.map((libro: any) => ({
      id: libro._id,
      titulo: libro.title,
      autor: Array.isArray(libro.author) ? libro.author.join(", ") : libro.author,
      portada: libro.image,
      categoria: libro.category || "Sin categoría",
      precio: libro.price || 0,
      valoracion: libro.rating || 0,
      cantidad: libro.stock || 0,
      isbn: libro.ISBN || "",
      numOpiniones: Array.isArray(libro.reviews) ? libro.reviews.length : 0,
      stock: typeof libro.stock === "number" ? libro.stock : 0,
    }));
  },
};
 