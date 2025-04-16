import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

type Props = {
  imagenLibro: string;
  titulo: string;
  autor: string;
};

const ResenaLibro: React.FC<Props> = ({ imagenLibro, titulo, autor }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleEnviar = () => {
    alert(`Calificación: ${calificacion}\nComentario: ${comentario || 'Ninguno'}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      {/* Regresar */}
      <button
        onClick={() => alert('Regresar')}
        className="self-start mb-4 text-sm flex items-center gap-2"
      >
        <span className="text-xl">←</span> Regresar
      </button>

      {/* Título */}
      <h1 className="text-xl font-bold text-red-800 mb-4">¿Qué te pareció el libro?</h1>

      {/* Portada + Info */}
      <img src={imagenLibro} alt={titulo} className="w-40 h-auto shadow-lg mb-2" />
      <p className="font-semibold uppercase text-center">{titulo}</p>
      <p className="text-sm text-gray-700 uppercase text-center mb-6">{autor}</p>

      {/* Calificación */}
      <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-3xl">
        {/* Estrellas */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium mb-2 text-center">Asigna una calificación general al libro</p>
          <div className="flex gap-1 text-2xl mb-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button key={num} onClick={() => setCalificacion(num)}>
                <FaStar className={num <= calificacion ? 'text-yellow-500' : 'text-gray-400'} />
              </button>
            ))}
          </div>
          <div className="flex justify-between w-full text-xs text-gray-600 px-2">
            <span>MALO</span>
            <span>EXCELENTE</span>
          </div>
        </div>

        {/* Comentario */}
        <div className="flex flex-col items-center w-full max-w-md">
          <label className="text-sm font-medium mb-2 text-center">
            Cuéntanos acerca del libro <span className="text-gray-500">(Opcional)</span>
          </label>
          <textarea
            className="w-full border rounded-md p-2 h-24 resize-none"
            placeholder="¿Qué te pareció el libro que compraste?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
      </div>

      {/* Botón Enviar */}
      <button
        onClick={handleEnviar}
        className="mt-6 bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-800"
      >
        Enviar opinión
      </button>
    </div>
  );
};

export default ResenaLibro;
