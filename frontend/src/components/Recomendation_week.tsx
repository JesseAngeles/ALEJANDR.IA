import React from 'react';

type Props = {
  imagenLibro: string;
  imagenAutora: string;
  tituloLibro: string;
  nombreAutora: string;
  onClick?: () => void;
};

const Recomendacion: React.FC<Props> = ({
  imagenLibro,
  imagenAutora,
  tituloLibro,
  nombreAutora,
  onClick = () => alert(`Recomendación: ${tituloLibro}`),
}) => {
  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div
        onClick={onClick}
        className="flex flex-col md:flex-row items-center justify-center gap-8 bg-red-900 text-white p-6 rounded-md shadow-md cursor-pointer hover:bg-red-800 transition"
      >
        <div className="flex items-center gap-4">
          <img
            src={imagenLibro}
            alt="Libro recomendado"
            className="w-24 h-auto shadow-lg"
          />
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold">Recomendación de la semana:</p>
            <p className="text-2xl font-bold">{tituloLibro}</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src={imagenAutora}
            alt="Autora"
            className="w-20 h-20 object-cover rounded-md border-2 border-white"
          />
          <p className="text-sm mt-2">Autor: {nombreAutora}</p>
        </div>
      </div>
    </div>
  );
};

export default Recomendacion;
