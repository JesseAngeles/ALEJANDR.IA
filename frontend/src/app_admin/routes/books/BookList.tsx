import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks, deleteBook } from "app_admin/services/bookService"; 
const BookList: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Cargar los libros cuando el componente se monta
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Error al obtener los libros", error);
      }
    };

    loadBooks();
  }, []); // Dependencia vacía para que solo se ejecute una vez al montar el componente

  // Función para eliminar un libro
  const handleDelete = async (isbn: string) => {
    try {
      await deleteBook(isbn); 
      setBooks(books.filter((book) => book.isbn !== isbn)); 
      alert("Libro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el libro", error);
      alert("Hubo un error al eliminar el libro");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Gestión de libros</h2>
      <input
        type="text"
        placeholder="Buscar libro"
        className="mb-4 w-full border px-3 py-2 rounded"
      />
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Título</th>
            <th className="p-2">Autor</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.isbn} className="border-t">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.isbn}</td>
              <td className="p-2 text-teal-600 font-semibold">${book.price}.00</td>
              <td className="p-2">{book.stock}</td>
              <td className="p-2 text-[#820000] text-center">
                <button
                  className="mr-3 hover:underline"
                  onClick={() => navigate(`/admin/libros/editar/${book.isbn}`, { state: book })}
                >
                  Editar
                </button>
                <button
                  className="hover:underline text-red-500"
                  onClick={() => handleDelete(book.isbn)} // Llamada a la función de eliminación
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
