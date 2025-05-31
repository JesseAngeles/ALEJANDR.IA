import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { searchService } from '@/app/domain/service/searchService';

// Íconos personalizados
import corazon from "@/assets/icons/corazon 1.png";
import misterio from "@/assets/icons/misterio 1.png";
import fantasia from "@/assets/icons/fantasia (1) 1.png";
import historia from "@/assets/icons/historia 1.png";
import academico from "@/assets/icons/ACADEMIA 1.png";

const CategoriasDestacadas: React.FC = () => {
  const [verMas, setVerMas] = useState(false);
  const [todasCategorias, setTodasCategorias] = useState<string[]>([]);
  const navigate = useNavigate();

  // actualizar cuando se coloquen las categorías en español
  const categoriasConIcono: { nombre: string; imagen: string; filtro: string }[] = [
    { nombre: 'ROMANCE', imagen: corazon, filtro: 'Romance' },
    { nombre: 'MISTERIO', imagen: misterio, filtro: 'Misterio' },
    { nombre: 'FANTASÍA', imagen: fantasia, filtro: 'Ficción' },
    { nombre: 'HISTORIA', imagen: historia, filtro: 'Historia' },
    { nombre: 'ACADÉMICO', imagen: academico, filtro: 'Educación' },
  ];

  useEffect(() => {
      const cargarCategorias = async () => {
        try {
          const libros: {
            categoria: string;
          }[] = await searchService.buscarTodos();
    
          const todasCategorias: string[] = libros.map((l) => l.categoria).filter(Boolean);
          const unicas: string[] = Array.from(new Set(todasCategorias)).sort((a, b) =>
            a.localeCompare(b)
          );
    
          setTodasCategorias(unicas);
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        }
      };
    
      cargarCategorias();
    }, []);

  const handleClickCategoria = (nombre: string) => {
    navigate(`/busqueda?query=${encodeURIComponent(nombre)}&filtro=categoria`);
  };

  // Categorías sin ícono que no están entre las destacadas
  const otrasCategorias = todasCategorias.filter(
    (cat) => !categoriasConIcono.some((destacada) => destacada.filtro === cat)
  );

  return (
    <section className="my-8">
      <h2 className="text-lg font-semibold mb-4">Categorías destacadas</h2>

      <div className="flex justify-center gap-6 flex-wrap mb-4">
        {categoriasConIcono.map((cat) => (
          <button
            key={cat.nombre}
            onClick={() => handleClickCategoria(cat.filtro)}
            className="flex flex-col items-center text-center hover:scale-105 transition"
          >
            <img src={cat.imagen} alt={cat.nombre} className="w-21 h-21 object-contain" />
            <span className="text-sm font-medium mt-1">{cat.nombre}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setVerMas(!verMas)}
          className="flex items-center gap-2 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition"
        >
          {verMas ? 'Ver menos categorías' : 'Ver más categorías'}
          {verMas ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {verMas && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cyan-100 p-6 rounded-md">
          {otrasCategorias.map((nombre) => (
            <button
              key={nombre}
              onClick={() => handleClickCategoria(nombre)}
              className="text-left text-sm hover:underline"
            >
              {nombre}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriasDestacadas;
