// src/app/domain/service/searchService.ts
import { tokenService } from "@/app/utils/tokenService";

export const searchService = {

  buscarTodos: async () => {
    const token = tokenService.getToken();
  
    const res = await fetch("http://localhost:8080/book", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
    }));
  },
  

  buscar: async (termino: string) => {
    const token = tokenService.getToken();

    const res = await fetch("http://localhost:8080/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
    }));
  },
};

