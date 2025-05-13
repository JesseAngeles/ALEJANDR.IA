import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BookSection from '../book/BookSection'
import Recomendacion from '../book/Recomendation_week'
import CategoriasDestacadas from '../category/Categories'
import { useCart } from "@/app/domain/context/CartContext";
import { bookService } from '@/app/domain/service/bookService'

interface Book {
    _id: string;
    title: string;
    image: string;
    author: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    ISBN: string;
    sinopsis: string; 
  }



 
  function HomePage() {
    const [collections, setCollections] = useState<{ nombre: string; libros: Book[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendedBook, setRecommendedBook] = useState<Book | null>(null);
    const { fetchCart } = useCart();
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchCart();
    }, []);
  
    useEffect(() => {
      const fetchCollections = async () => {
        try {
          const data = await bookService.obtenerRecomendados();
          setCollections(data);
          setLoading(false);
        } catch (err) {
          console.error("Error al obtener colecciones:", err);
          setError("No se pudieron cargar los libros.");
          setLoading(false);
        }
      };
  
      fetchCollections();
    }, []);
  
    useEffect(() => {
      const fetchRecomendado = async () => {
        try {
          const data = await bookService.obtenerUnoRecomendado();
          setRecommendedBook(data);
        } catch (err) {
          console.error("Error al obtener recomendado:", err);
        }
      };
  
      fetchRecomendado();
    }, []);
  
    if (error) return <p className="text-red-500">{error}</p>;
  
    return (
      <main className="flex-grow p-6">
        {recommendedBook && <Recomendacion book={recommendedBook} />}
        {collections.map((col, idx) => (
          <BookSection key={idx} tituloSeccion={col.nombre} books={col.libros} />
        ))}
        <CategoriasDestacadas />
      </main>
    );
  }
  

export { HomePage };
