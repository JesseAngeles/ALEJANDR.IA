import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import corazon from "../icons/corazon 1.png"
import misterio from "../icons/misterio 1.png"
import fantasia from "../icons/fantasia (1) 1.png"
import historia from "../icons/historia 1.png"
import academico from "../icons/ACADEMIA 1.png"

type Categoria = {
  nombre: string;
  imagen: string; // ruta de la imagen
  onClick?: () => void; // acción al presionar el botón (opcional)
};

const CategoriasDestacadas: React.FC = () => {
  const [verMas, setVerMas] = useState(false);

  const categoriasDestacadas: Categoria[] = [
    { nombre: 'ROMANCE', imagen:  corazon},
    { nombre: 'MISTERIO', imagen: misterio },
    { nombre: 'FANTASÍA', imagen:  fantasia},
    { nombre: 'HISTORIA', imagen:  historia},
    { nombre: 'ACADÉMICO', imagen:  academico},
  ];

  return (
    <section className="my-8">
      <h2 className="text-lg font-semibold mb-4">Categorías destacadas</h2>
      
      {/* Botones de categorías */}
      <div className="flex justify-center gap-6 flex-wrap mb-4">
        {categoriasDestacadas.map((cat) => (
          <button
            key={cat.nombre}
            className="flex flex-col items-center text-center hover:scale-105 transition"
            onClick={cat.onClick ?? (() => alert(`Seleccionaste ${cat.nombre}`))}
          >
            <img src={cat.imagen} alt={cat.nombre} className="w-14 h-14 object-contain" />
            <span className="text-sm font-medium mt-1">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Botón de ver más */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setVerMas(!verMas)}
          className="flex items-center gap-2 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition"
        >
          {verMas ? 'Ver menos categorías' : 'Ver más categorías'}
          {verMas ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Contenido desplegable */}
      {verMas && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cyan-100 p-6 rounded-md">
          <div>
            <h3 className="font-semibold border-b mb-2">Ficción</h3>
            <ul className="space-y-1 text-sm">
              <li><button className="hover:underline">Ciencia ficción</button></li>
              <li><button className="hover:underline">Fantasía</button></li>
              <li><button className="hover:underline">Romance</button></li>
              <li><button className="hover:underline">Misterio</button></li>
              <li><button className="hover:underline">Poesía</button></li>
              <li><button className="hover:underline">Clásicos</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold border-b mb-2">No Ficción</h3>
            <ul className="space-y-1 text-sm">
              <li><button className="hover:underline">Ciencias Políticas</button></li>
              <li><button className="hover:underline">Economía</button></li>
              <li><button className="hover:underline">Filosofía</button></li>
              <li><button className="hover:underline">Lingüística</button></li>
              <li><button className="hover:underline">Matemáticas</button></li>
              <li><button className="hover:underline">Química</button></li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoriasDestacadas;
