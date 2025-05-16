import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchBooks, deleteBook } from "app_admin/services/bookService";
import { useAuth } from "@/app_admin/context/AdminAuthContext";

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
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
  }, [token, location.state?.updated]);

  const handleDelete = async (isbn: string) => {
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      await deleteBook(isbn, token);
      setBooks(books.filter((book) => book.ISBN !== isbn));
      setShowSuccessModal(true); 
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

  const handleCloseModal = () => {
    setShowSuccessModal(false); 
    setTimeout(() => navigate("/admin/libros", { state: { updated: true } }), 2000); 
  };

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
            <th className="p-2">Categoría</th>
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
              <td className="p-2">{book.category}</td>
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

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#00000] mb-4">
              ¡Libro eliminado correctamente!
            </h3>
            <button
              onClick={handleCloseModal}
              className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { BookList };
