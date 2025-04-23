import React from 'react';

type Props = {
  imagen: string;
  titulo: string;
  autor: string;
  precio: number;
  disponible: boolean;
  sinopsis: string;
  precioDescuento?: number;
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

const CompraLibro: React.FC<Props> = ({
  imagen,
  titulo,
  autor,
  precio,
  disponible,
  sinopsis,
  precioDescuento,
  enCarrito,
  onAgregarAlCarrito,
  onEliminarDelCarrito,
  categoria,
  isbn,
  editorial,
  anioEdicion,
  medidas,
  numeroPaginas,
  encuadernacion,
}) => {
  return (
    <div className="min-h-screen px-6 py-10">
      {/* Botón regresar */}
      <button
        onClick={() => window.history.back()}
        className="text-base mb-6 flex items-center gap-2"
      >
        <span className="text-2xl">←</span> Regresar
      </button>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Imagen */}
          <img src={imagen} alt={titulo} className="w-60 h-auto rounded shadow-xl" />

          {/* Detalles */}
          <div className="flex flex-col gap-4 w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-red-800">{titulo}</h2>
            <p className="text-lg uppercase tracking-wide">{autor}</p>

            <div className="text-2xl font-semibold">
              {precioDescuento ? (
                <>
                  <span className="text-gray-400 line-through mr-3">${precio.toFixed(2)}</span>
                  <span className="text-cyan-700">${precioDescuento.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-cyan-700">${precio.toFixed(2)}</span>
              )}
            </div>

            <p className={`text-lg ${disponible ? 'text-green-600' : 'text-red-600'}`}>
              {disponible ? 'Disponible' : 'No disponible'}
            </p>

            {enCarrito && (
              <p className="text-sm text-gray-700 italic">Libro agregado al carrito</p>
            )}

            <div className="flex gap-4 flex-wrap">
              <button className="bg-cyan-700 text-white px-6 py-2 text-base rounded hover:bg-cyan-800 transition">
                Comprar
              </button>
              {enCarrito ? (
                <button
                  onClick={onEliminarDelCarrito}
                  className="bg-cyan-100 text-cyan-800 px-6 py-2 text-base rounded hover:bg-cyan-200 transition"
                >
                  Eliminar del carrito
                </button>
              ) : (
                <button
                  onClick={onAgregarAlCarrito}
                  className="bg-cyan-100 text-cyan-800 px-6 py-2 text-base rounded hover:bg-cyan-200 transition"
                >
                  Agregar al carrito
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sinopsis */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-red-800 mb-2">SINOPSIS</h3>
          <hr className="border-t border-gray-300 mb-4" />
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {sinopsis}
          </p>
        </div>

        {/* Información adicional */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-red-800 uppercase mb-2">Información adicional</h3>
          <hr className="border-t border-gray-300 mb-4" />

          <div className="grid gap-2 text-sm text-gray-800">
            <div className="flex">
              <span className="w-48 font-semibold">Categoría:</span>
              <span>{categoria}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">ISBN:</span>
              <span>{isbn}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">Editorial:</span>
              <span>{editorial}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">Año de edición:</span>
              <span>{anioEdicion}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">Medidas:</span>
              <span>{medidas}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">Número de páginas:</span>
              <span>{numeroPaginas}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-semibold">Encuadernación:</span>
              <span>{encuadernacion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CompraLibro };
