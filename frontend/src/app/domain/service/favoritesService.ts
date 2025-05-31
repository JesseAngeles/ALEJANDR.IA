// src/app/domain/service/favoritesService.ts
import { tokenService } from "@/app/utils/tokenService";
import { forceLogout } from "@/app/utils/logoutHelper";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
  ISBN: string;
};



const API_URL = `${import.meta.env.VITE_ENDPOINT}/collection`;

let cachedCollectionId: string | null = null;

let isCreating = false; // ← fuera de la función

async function getFavoritesCollectionId(): Promise<string> {
  if (cachedCollectionId) {
    console.log("✅ ID de colección 'favoritos' en caché:", cachedCollectionId);
    return cachedCollectionId;
  }

  if (isCreating) {
    console.log("⏳ Esperando a que se cree 'favoritos'...");
    // Esperar 500 ms y reintentar
    await new Promise((r) => setTimeout(r, 500));
    return getFavoritesCollectionId();
  }

  const token = tokenService.getToken();
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const res = await fetch(API_URL, { method: "GET", headers });

  const collections = await res.json();
  const favoritos = Array.isArray(collections)
    ? collections.find((col: any) => col.name?.trim().toLowerCase() === "favoritos")
    : null;

  if (favoritos) {
    cachedCollectionId = favoritos._id;
    return cachedCollectionId!;
  }

  // 🔒 Evitar múltiples creaciones en paralelo
  isCreating = true;

  const createRes = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: "favoritos", books: [] }),
  });

  isCreating = false;

  if (createRes.status === 409) {
    return getFavoritesCollectionId(); // si otro request la creó antes
  }

  if (!createRes.ok) throw new Error("Error al crear la colección");

  const nuevaColeccion = await createRes.json();
  cachedCollectionId = nuevaColeccion._id;
  return cachedCollectionId!;
}






export const favoritesService = {
  getFavorites: async () => {
    const token = tokenService.getToken();
    const collectionId = await getFavoritesCollectionId();

    console.log("📥 Obteniendo libros de favoritos:", collectionId);

    const res = await fetch(`${API_URL}/${collectionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada.");
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error al obtener favoritos:", text);
      throw new Error("Error al obtener favoritos");
    }

    const collection = await res.json();

    const libros = await Promise.all(
      collection.books.map(async (bookId: string) => {
        try {
          const res = await fetch(`http://localhost:8080/book/id/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            console.warn("⚠ No se pudo obtener libro:", bookId);
            return null;
          }

          const libroRaw = await res.json();

          if (
            typeof libroRaw !== "object" ||
            !libroRaw._id ||
            !libroRaw.title ||
            !libroRaw.author ||
            !libroRaw.price ||
            !libroRaw.image ||
            !libroRaw.ISBN
          ) {
            console.warn("⚠ Libro con datos incompletos:", libroRaw);
            return null;
          }

          const libro: Libro = {
            id: libroRaw._id,
            titulo: libroRaw.title,
            autor: libroRaw.author,
            precio: libroRaw.price,
            imagen: libroRaw.image,
            ISBN: libroRaw.ISBN, // ✅ Asegúrate de que el backend lo devuelva
          };


          return libro;
        } catch (err) {
          console.error("❌ Error al procesar libro:", err);
          return null;
        }
      })
    );

    // 💡 Filtramos los que no pasaron la validación
    return libros.filter((libro): libro is Libro => !!libro);


  },


  addToFavorites: async (isbn: string) => {
    const token = tokenService.getToken();
    const collectionId = await getFavoritesCollectionId();

    const res = await fetch(`${API_URL}/${collectionId}/book/${isbn}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada.");
    }

    if (!res.ok) throw new Error("Error al agregar a favoritos");
    return await res.json();
  },

  removeFromFavorites: async (isbn: string) => {
    const token = tokenService.getToken();
    const collectionId = await getFavoritesCollectionId();

    const res = await fetch(`${API_URL}/${collectionId}/book/${isbn}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada.");
    }

    if (!res.ok) throw new Error("Error al eliminar de favoritos");
    return await res.json();
  },


  clearCache: () => {
    cachedCollectionId = null;
    isCreating = false;
    console.log("🧹 Caché de favoritos limpiada");
  },

};

