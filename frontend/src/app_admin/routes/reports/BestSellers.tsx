import React, { useEffect, useState } from "react";
import { getBooks } from "../../services/reportsService"; 

interface Book {
  title: string;
  author: string;
  quantity: number;
}

const BestSellers: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los libros más vendidos");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Libros más vendidos</h2>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Título</th>
              <th className="p-2">Autor</th>
              <th className="p-2">Unidades vendidas</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{book.title}</td>
                <td className="p-2">{book.author}</td>
                <td className="p-2">{book.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export { BestSellers };
