import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BookSection from '../book/BookSection'
import Recomendacion from '../book/Recomendation_week'
import CategoriasDestacadas from '../category/Categories'
import { useCart } from "@/app/domain/context/CartContext";


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
    const [count, setCount] = useState(0)
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendedBook, setRecommendedBook] = useState<Book | null>(null);
    const { fetchCart } = useCart();

useEffect(() => {
  fetchCart(); // sincroniza el estado del carrito al volver a home
}, []);


    

  useEffect(() => {
    fetch('http://localhost:8080/book/')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setError('No se pudieron cargar los libros.');
        setLoading(false);
      });
  }, []);



    useEffect(() => {
        fetch('http://localhost:8080/book/9780547739465') //Cambiar por un endpoint de recomendación semanal
            .then(res => res.json())
            .then(data => setRecommendedBook(data))
        .catch(err => console.error('Error fetching recommended book:', err));
    }, []);



  //if (loading) return <p>Cargando libros...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


    return (
        <>
            

            <main className="flex-grow p-6">
                {recommendedBook && (<Recomendacion book={recommendedBook} />)}
                <BookSection tituloSeccion="Novedades" books={books} />
                <BookSection tituloSeccion="Lo mas visto" books={books} />
                <CategoriasDestacadas />
            </main>
        </>
    )
}

export { HomePage };
