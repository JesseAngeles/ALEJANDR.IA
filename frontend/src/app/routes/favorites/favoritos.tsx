import React from "react";
import { useFavorites } from "@/app/domain/context/FavoritesContext";
import { Favorites } from "./FavoritesSection";

function Favoritos() {
  const { favoritos, loading } = useFavorites();

  if (loading) return <p className="p-6">Cargando favoritos...</p>;

  return <Favorites libros={favoritos} />;
}

export { Favoritos };
