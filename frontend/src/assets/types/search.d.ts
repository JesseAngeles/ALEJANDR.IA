export type FiltroDisponible = {
    seccion: string;       // Ej: "Autor", "Editorial"
    opciones: string[];    // Ej: ["Gabriel García Márquez", "Porrúa"]
  };
  
  export type ResultadoBusqueda = {
    id: string;
    titulo: string;
    autor: string;
    portada: string; // o StaticImageData si usas Next.js y `import`
  };
  
  export type SearchResultsProps = {
    terminoBusqueda: string;
    filtrosDisponibles: FiltroDisponible[];
    resultados: ResultadoBusqueda[];
  };
  