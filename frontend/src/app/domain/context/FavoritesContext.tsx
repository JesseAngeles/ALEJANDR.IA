import React, { createContext, useContext, useEffect, useState } from "react";
import { favoritesService } from "@/app/domain/service/favoritesService";

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  imagen: string;
  ISBN: string;
};

interface FavoritesContextType {
  favoritos: Libro[];
  loading: boolean;
  fetchFavorites: () => Promise<void>;
  isFavorite: (bookId: string) => boolean;
  addToFavorites: (isbn: string) => Promise<void>;
  removeFromFavorites: (isbn: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoritos, setFavoritos] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await favoritesService.getFavorites();
      setFavoritos(data); // ✅ <- CORREGIDO
      console.log("✅ Libros favoritos cargados:", data);
    } catch (err) {
      console.error("Error fetching favoritos", err);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
  
    const fetch = async () => {
      if (!ignore) {
        await fetchFavorites();
      }
    };
  
    fetch();
  
    return () => {
      ignore = true;
    };
  }, []);
  

  const isFavorite = (bookId: string) => {
    return favoritos.some((libro) => libro.id === bookId);

  };
  

  const addToFavorites = async (isbn: string) => {
    await favoritesService.addToFavorites(isbn);
    await fetchFavorites();
  };

  const removeFromFavorites = async (isbn: string) => {
    await favoritesService.removeFromFavorites(isbn);
    await fetchFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        loading,
        fetchFavorites,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  return context;
};
 