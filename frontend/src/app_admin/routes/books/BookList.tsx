import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks, deleteBook } from "app_admin/services/bookService";
import { useAuth } from "@/app_admin/context/AdminAuthContext"; 

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBooks = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const booksData = await fetchBooks(token); 
        console.log("Libros recibidos:", booksData);
        setBooks(booksData);
      } catch (error) {
        console.error("Error al obtener los libros", error);
      }
    };

    loadBooks();
  }, [token]); 

  const handleDelete = async (isbn: string) => {
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      await deleteBook(isbn, token); 
      setBooks(books.filter((book) => book.ISBN !== isbn));
      alert("Libro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el libro", error);
      alert("Hubo un error al eliminar el libro");
    }
  };

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.ISBN}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Gestión de libros</h2>
      <input
        type="text"
        placeholder="Buscar libro"
        className="mb-4 w-full border px-3 py-2 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Portada</th>
            <th className="p-2">Título</th>
            <th className="p-2">Autor</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.ISBN} className="border-t">
              <td className="p-2">
                <img src={book.image} alt={book.title} className="w-16 h-auto" />
              </td>
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.ISBN}</td>
              <td className="p-2 text-teal-600 font-semibold">${book.price}.00</td>
              <td className="p-2">{book.stock}</td>
              <td className="p-2 text-[#820000] text-center">
                <button
                  className="mr-3 hover:underline"
                  onClick={() =>
                    navigate(`/admin/libros/editar/${book.ISBN}`, { state: book })
                  }
                >
                  Editar
                </button>
                <button
                  className="hover:underline text-red-500"
                  onClick={() => handleDelete(book.ISBN)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate("/admin/libros/agregar")}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Añadir libro
        </button>
      </div>
    </div>
  );
};

export { BookList };

