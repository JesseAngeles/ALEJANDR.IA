
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Recomendacion from "./components/Recomendation_week"
import BookSection from "./components/BookSection";
import AlasOnix from "./assets/portada_libro.jpg"
import RebeccaYarros from "./assets/Rebecca_Yarros.jpg"
import CategoriasDestacadas from "./components/Categories";

const librosEjemplo = [
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
  {
    id: "1",
    titulo: "Un Fuego Azul",
    autor: "Pedro Feijoo",
    precio: 249,
    imagen: AlasOnix, 
  },
  {
    id: "2",
    titulo: "Eres Todo Para Mí",
    autor: "Sylvia Day",
    precio: 199,
    imagen: AlasOnix,
  },
  {
    id: "3",
    titulo: "Río Bravo",
    autor: "Julio Vaquero",
    precio: 215,
    imagen: AlasOnix,
  },
];


const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Recomendacion
        imagenLibro={AlasOnix}
        imagenAutora={RebeccaYarros}
        tituloLibro= "Alas de Onix"
        nombreAutora="Rebeca Yarros"
        onClick={() => navigate('/libro/alas-de-onix')}
        />

      <main className="flex-grow p-6">

        <BookSection tituloSeccion="Novedades" libros={librosEjemplo} />
        <BookSection tituloSeccion="Lo mas visto" libros={librosEjemplo} />
        <CategoriasDestacadas/>
      </main>
      <Footer />
    </div>
  );
};

export default App;
