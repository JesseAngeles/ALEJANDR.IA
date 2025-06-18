import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BookSection from '../book/BookSection'
import Recomendacion from '../book/Recomendation_week'
import CategoriasDestacadas from '../category/Categories'
import { useCart } from "@/app/domain/context/CartContext";
import { bookService } from '@/app/domain/service/bookService'
import { useAuth } from "@/app/domain/context/AuthContext";
import { useToast } from '@/app/domain/context/ToastContext'

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
    numOpiniones: number;
    createdAt: string;
  }


 
 
  function HomePage() {
    const { state } = useLocation();
    const { welcomeMessage } = state || {};  
    const { showToast } = useToast(); 


    const [collections, setCollections] = useState<{ nombre: string; libros: Book[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendedBook, setRecommendedBook] = useState<Book | null>(null);
    const [toastShown, setToastShown] = useState(false);
    const { fetchCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    

    function getDateFromObjectId(objectId: string): string {
      const timestampHex = objectId.substring(0, 8);
      const timestamp = parseInt(timestampHex, 16) * 1000; // convertir a milisegundos
      return new Date(timestamp).toISOString();
    }
    

    useEffect(() => {
      const fetchAllCollections = async () => {
        try {
          const colecciones: { nombre: string; libros: Book[] }[] = [];
    
          if (user?.id) {
            const recomendadas = await bookService.obtenerRecomendados(user.id);
            colecciones.push(...recomendadas);
          }
    
          const todos = await bookService.obtenerTodos();
          const formateados: Book[] = todos.map((libro: any) => ({
            _id: libro.id,
            title: libro.title,
            author: libro.author,
            image: libro.image,
            category: libro.category,
            price: libro.price,
            stock: libro.stock,
            ISBN: libro.ISBN,
            rating: libro.rating,
            reviews: libro.reviews || [],
            reviewSumary: libro.reviewSumary || "",
            sinopsis: libro.sinopsis || "",
            numOpiniones: Array.isArray(libro.reviews) ? libro.reviews.length : 0,
            createdAt: getDateFromObjectId(libro.id),
          }));
    
          const mejoresValorados = [...formateados].sort((a, b) => b.rating - a.rating).slice(0, 15);
          const masPopulares = [...formateados].sort((a, b) => b.numOpiniones - a.numOpiniones).slice(0, 15);
          // const masRecientes = [...formateados].sort((a, b) =>
          //   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          // ).slice(0, 15);
    
          colecciones.push(
            { nombre: "Mejores valorados", libros: mejoresValorados },
            { nombre: "Más populares", libros: masPopulares },
            // { nombre: "Más recientes", libros: masRecientes }
          );
    
          setCollections(colecciones);
        } catch (err) {
          console.error("❌ Error al obtener colecciones:", err);
          setError("No se pudieron cargar los libros.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchAllCollections();
    }, [user]);
    
    
    
    
    
    
  
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

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative text-center max-w-xl mx-auto mt-10 shadow-md">
          <strong className="block font-bold text-lg mb-1">¡Ups! 😕</strong>
          En este momento no se pueden cargar las recomendaciones. Por favor, vuelve a intentarlo más tarde.
        </div>
      );
    }
    
  
    return (
      <main className="flex-grow p-6">
        {recommendedBook && <Recomendacion book={recommendedBook} />}
        {collections.map((col, idx) => (
          <BookSection key={col.nombre} tituloSeccion={col.nombre} books={[...col.libros] } />
        ))}
        <CategoriasDestacadas />
      </main>
    );
  }
  

export { HomePage };