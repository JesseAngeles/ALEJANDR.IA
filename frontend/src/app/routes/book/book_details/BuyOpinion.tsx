import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type Review = {
  rating: number;
  comment: string;
  createdAt: string;
};

type Props = {
  reviews: Review[];
  isbn: string;
  resumen: string; // ← nuevo prop
};


type MicroSummary = {
  ISBN: string;
  title: string;
  summary: string;
  average_rating: number;
  total_reviews: number;
};




const OpinionesLibro: React.FC<Props> = ({ reviews, isbn, resumen }) => {
  const navigate = useNavigate();
  const totalValoraciones = reviews.length;
  const promedio =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const [filtro, setFiltro] = useState<'ninguno' | 'recientes' | 'calificacion'>('ninguno');
  const ordenarOpiniones = () => {
    const copia = [...reviews];
    if (filtro === 'recientes') {
      return copia.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filtro === 'calificacion') {
      return copia.sort((a, b) => b.rating - a.rating);
    }
    return copia;
  };

  const [verTodas, setVerTodas] = useState(false);
  const [filtroRecientes, setFiltroRecientes] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);
  const [filtroAntiguos, setFiltroAntiguos] = useState(false);

  let opinionesFiltradas = [...reviews];

  if (filtroRecientes) {
    opinionesFiltradas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filtroAntiguos) {
    opinionesFiltradas.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }


  if (filtroCalificacion !== null) {
    opinionesFiltradas = opinionesFiltradas.filter(r => Math.round(r.rating) === filtroCalificacion);
  }

  const opinionesAMostrar = verTodas ? opinionesFiltradas : opinionesFiltradas.slice(0, 2);








  const valoracionesPorEstrella = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = Math.round(r.rating) - 1;
    if (idx >= 0 && idx < 5) valoracionesPorEstrella[idx]++;
  });

  const renderStars = (cantidad: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`inline text-xl ${i < cantidad ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ));

  const renderEstrellasPromedio = (prom: number) => {
    const cantidadEstrellas = Math.round(prom);
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

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h3 className="text-xl font-bold text-red-800 uppercase mb-2">Opiniones</h3>
      <hr className="border-t border-gray-300 mb-6" />

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-y-6 gap-x-12 justify-center">
          <div className="flex flex-col items-center lg:items-start">
            {renderEstrellasPromedio(promedio)}
            <div className="text-3xl font-bold mt-2">{promedio.toFixed(1)}/5.0</div>
            <div className="text-sm text-gray-600">{reviews.length} valoraciones</div>
          </div>

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

      <div className="mt-8">
        <h4 className="text-lg font-bold text-red-700 mb-1">Resumen</h4>
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {resumen}
        </p>

      </div>


      {reviews.length > 2 && (
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          {/* Botones de fecha */}
          <button
            onClick={() => {
              setFiltroRecientes(false);
              setFiltroAntiguos(false);
            }}
            className={`px-4 py-2 rounded font-medium text-white ${(!filtroRecientes && !filtroAntiguos) ? 'bg-gray-400' : 'bg-gray-500'
              } hover:bg-gray-500 transition`}
          >
            Cualquier fecha
          </button>

          <button
            onClick={() => {
              setFiltroAntiguos(!filtroAntiguos);
              setFiltroRecientes(false);
            }}
            className={`px-4 py-2 rounded font-medium text-white ${filtroAntiguos ? 'bg-cyan-800' : 'bg-gray-400'
              } hover:bg-cyan-700 transition`}
          >
            Más antiguos
          </button>

          <button
            onClick={() => {
              setFiltroRecientes(!filtroRecientes);
              setFiltroAntiguos(false);
            }}
            className={`px-4 py-2 rounded font-medium text-white ${filtroRecientes ? 'bg-cyan-800' : 'bg-gray-400'
              } hover:bg-cyan-700 transition`}
          >
            Más recientes
          </button>

          {/* Botones de calificación */}
          {[5, 4, 3, 2, 1, 0].map((estrella) => (
            <button
              key={estrella}
              onClick={() =>
                setFiltroCalificacion((prev) => (prev === estrella ? null : estrella))
              }
              className={`px-4 py-2 rounded font-medium text-white ${filtroCalificacion === estrella ? 'bg-yellow-600' : 'bg-gray-400'
                } hover:bg-yellow-500 transition`}
            >
              {estrella} ★
            </button>
          ))}
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6">

        {opinionesAMostrar.map((review, idx) => (
          <div key={idx}>
            <div className="mb-1">{renderStars(review.rating)}</div>
            <div className="text-xs text-gray-500 mb-2">
              {new Date(review.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <p className="text-sm text-gray-800">{review.comment}</p>
          </div>
        ))}
      </div>

      {opinionesFiltradas.length > 2 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVerTodas(!verTodas)}
            className="bg-cyan-700 text-white text-sm font-medium px-6 py-2 rounded hover:bg-cyan-800 transition"
          >
            {verTodas ? 'Ocultar opiniones' : 'Ver más opiniones'}
          </button>
        </div>
      )}


    </div>
  );
};

export { OpinionesLibro };
