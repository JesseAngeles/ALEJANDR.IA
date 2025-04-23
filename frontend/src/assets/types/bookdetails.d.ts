export type BookDetails = {
    imagen: string; // URL o import estático de la imagen (puede ser `StaticImport` si usas Next.js)
    titulo: string;
    autor: string;
    precio: number;
    disponible: boolean;
    precioDescuento?: number;
    sinopsis: string;
    enCarrito: boolean;
    onAgregarAlCarrito: () => void;
    onEliminarDelCarrito: () => void;
    categoria: string;
    isbn: string;
    editorial: string;
    anioEdicion: number;
    medidas: string;
    numeroPaginas: number;
    encuadernacion: string;
  };
  