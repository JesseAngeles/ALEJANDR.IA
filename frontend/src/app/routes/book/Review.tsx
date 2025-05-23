import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { bookService } from "@/app/domain/service/bookService";

interface Book {
  _id: string;
  title: string;
  author: string | string[];
  image: string;
  ISBN: string;
  price: number;
  rating: number;
}

const Review: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario de reseña
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      if (!isbn) {
        setError("ISBN no válido");
        setLoading(false);
        return;
      }

      try {
        const bookData = await bookService.obtenerPorISBN(isbn);
        setBook(bookData);
      } catch (error) {
        console.error("Error al obtener el libro:", error);
        setError("Error al cargar los datos del libro");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [isbn]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isbn || !rating || !comment.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await bookService.crearOpinion(isbn, {
        rating,
        comment: comment.trim()
      });

      // Redirigir de vuelta después de crear la opinión
      navigate(-1);
    } catch (error) {
      console.error("Error al crear la opinión:", error);
      setError("Error al enviar la reseña. Por favor, intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Botón regresar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <h1 className="text-2xl font-bold text-[#820000] mb-6">Escribir Reseña</h1>

      {/* Información del libro */}
      {book && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-4">
            <img
              src={book.image}
              alt={book.title}
              className="w-24 h-32 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-semibold text-[#820000]">{book.title}</h2>
              <p className="text-gray-600 mb-2">
                {Array.isArray(book.author) ? book.author.join(", ") : book.author}
              </p>
              <p className="text-sm text-gray-500">ISBN: {book.ISBN}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de reseña */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmitReview}>
          {/* Calificación */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl transition-colors ${star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                    }`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                />
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Has seleccionado {rating} estrella{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comentario *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu opinión sobre el libro..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#820000] focus:border-transparent"
              rows={6}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || !rating || !comment.trim()}
              className="bg-[#820000] text-white px-6 py-2 rounded hover:bg-[#660000] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Enviar Reseña"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Review };
