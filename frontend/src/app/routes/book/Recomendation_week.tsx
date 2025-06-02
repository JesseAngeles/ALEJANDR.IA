import React from 'react';
import { useNavigate } from 'react-router-dom';

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
}

interface RecomendacionProps {
  book: Book;
}

const Recomendacion: React.FC<RecomendacionProps> = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div
        onClick={() => navigate(`/book/${book.ISBN}`)}
        className="flex items-center justify-center gap-6 bg-red-900 text-white p-6 rounded-md shadow-md cursor-pointer hover:bg-red-800 transition"
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-24 h-auto shadow-lg"
        />
        <div className="text-center">
          <p className="text-lg font-semibold">Te recomendamos leer:</p>
          <p className="text-2xl font-bold">{book.title}</p>
          <p className="text-sm mt-1">Autor: {book.author}</p>
        </div>
      </div>
    </div>
  );
};

export default Recomendacion;
