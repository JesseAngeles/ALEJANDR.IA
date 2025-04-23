import AlasOnix from '@/assets/img/portada_libro.jpg'
import { SearchResultsProps } from '../types/search'


export const searchresults: SearchResultsProps[] = [
  {
    terminoBusqueda: "amor",
    filtrosDisponibles: [
      { seccion: "Autor", opciones: ["Gabriel García Márquez", "Horacio Quiroga"] },
      { seccion: "Idioma", opciones: ["Español", "Inglés"] },
    ],
    resultados: [
      {
        id: "1",
        titulo: "El amor en los tiempos de cólera",
        autor: "Gabriel García Márquez",
        portada: AlasOnix,
      },
      {
        id: "2",
        titulo: "Cuentos de amor",
        autor: "Horacio Quiroga",
        portada: AlasOnix,
      },
    ],
  },
];

