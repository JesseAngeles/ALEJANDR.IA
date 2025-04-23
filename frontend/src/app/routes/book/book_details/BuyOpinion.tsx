import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type Opinion = {
  estrellas: number;
  fecha: string;
  mensaje: string;
};

type Props = {
  promedio: number;
  totalValoraciones: number;
  valoracionesPorEstrella: number[];
  resumen: string;
  opiniones: Opinion[];
};

const OpinionesLibro: React.FC<Props> = ({
  promedio,
  totalValoraciones,
  valoracionesPorEstrella,
  resumen,
  opiniones,
}) => {
  const navigate = useNavigate();

  const renderEstrellasPromedio = (prom: number) => {
    const cantidadEstrellas = Math.round(prom); // redondear al entero más cercano
  
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`text-2xl ${i < cantidadEstrellas ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  
  
  

  const renderStars = (cantidad: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`inline text-yellow-500 text-xl ${
          i < cantidad ? '' : 'text-gray-300'
        }`}
      />
    ));

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h3 className="text-xl font-bold text-red-800 uppercase mb-2">Opiniones</h3>
      <hr className="border-t border-gray-300 mb-6" />

      {/* Promedio y distribución */}
      <div className="w-full max-w-5xl mx-auto px-4">
  <div className="flex flex-col lg:flex-row items-start gap-y-6 gap-x-12 justify-center">
    {/* promedio de estrellas */}
    <div className="flex flex-col items-center lg:items-start">
      {renderEstrellasPromedio(promedio)}
      <div className="text-3xl font-bold mt-2">{promedio.toFixed(1)}/5</div>
      <div className="text-sm text-gray-600">{totalValoraciones} valoraciones</div>
    </div>

    {/* distribución de valoraciones */}
    <div className="flex flex-col gap-1">
      {[5, 4, 3, 2, 1].map((estrella) => (
        <div key={estrella} className="flex items-center gap-2">
          {renderStars(estrella)}
          <span className="text-sm text-gray-600">
            {valoracionesPorEstrella[estrella - 1] || 0} valoraciones
          </span>
        </div>
      ))}
    </div>
  </div>
</div>


      {/* Resumen */}
      <div className="mt-8">
        <h4 className="text-lg font-bold text-red-700 mb-1">Resumen</h4>
        <p className="text-sm text-gray-800 leading-relaxed">{resumen}</p>
      </div>

      {/* Opiniones individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6">
        {opiniones.map((opinion, idx) => (
          <div key={idx}>
            <div className="mb-1">{renderStars(opinion.estrellas)}</div>
            <div className="text-xs text-gray-500 mb-2">{opinion.fecha}</div>
            <p className="text-sm text-gray-800">{opinion.mensaje}</p>
          </div>
        ))}
      </div>

      {/* Botón */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/opiniones')}
          className="bg-cyan-700 text-white text-sm font-medium px-6 py-2 rounded hover:bg-cyan-800 transition"
        >
          Ver más opiniones
        </button>
      </div>
    </div>
  );
};

export { OpinionesLibro} ;
