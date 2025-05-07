import { CompraLibro } from "./BuyBook";
import { OpinionesLibro } from "./BuyOpinion";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

interface Review {
  userId: string;
  rating: number;
  comment: string;
  _id: string;
  createdAt: string;
}

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
  reviews: Review[];
  reviewSumary: string;
  sinopsis: string;
}

function BookDetails() {
  const [recommendedBook, setRecommendedBook] = useState<Book | null>(null);
  const { isbn } = useParams();
  console.log(isbn);


  useEffect(() => {
    fetch(`http://localhost:8080/book/${isbn}`)
      .then(res => res.json())
      .then(data => setRecommendedBook(data))
      .catch(err => console.error('Error fetching book details:', err));
  }, [isbn]);

  if (!recommendedBook) return <p>Cargando...</p>;

  return (
    <>
    <div className="space-y-6"> 
    <CompraLibro
  book={recommendedBook}
  enCarrito={false}
  onAgregarAlCarrito={() => {}}
  onEliminarDelCarrito={() => {}}
/>
<OpinionesLibro
  reviews={recommendedBook.reviews || []}
  isbn={recommendedBook.ISBN}
  resumen={recommendedBook.reviewSumary}
/>

</div>
      
    </>
  );
}

export { BookDetails };
