import { Opinion } from "./opinion";

export type OpinionesLibroProps = {
    promedio: number;                  // Promedio general de calificaciones
    totalValoraciones: number;        // Número total de valoraciones
    valoracionesPorEstrella: number[]; // Cantidad por cada estrella (índice 0 = 1 estrella, etc.)
    resumen: string;                  // Resumen global del contenido
    opiniones: Opinion[];             // Lista de opiniones individuales
  };