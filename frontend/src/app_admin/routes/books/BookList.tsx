import React from "react";
import { useNavigate } from "react-router-dom";

const BookList: React.FC = () => {
  const navigate = useNavigate();

  const books = [
    {
      id: 1,
      title: "UN FUEGO AZUL",
      author: "PEDRO FEIJOO",
      isbn: "0-7645-2641-3",
      price: 569,
      stock: 20,
    },
    {
      id: 2,
      title: "ERES TODO PARA MÍ",
      author: "SYLVIA DAY",
      isbn: "0-9876-5432-1",
      price: 569,
      stock: 13,
    },
  ];

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
            <tr key={book.id} className="border-t">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.isbn}</td>
              <td className="p-2 text-teal-600 font-semibold">${book.price}.00</td>
              <td className="p-2">{book.stock}</td>
              <td className="p-2 text-[#820000]">
                <button
                  className="mr-3 hover:underline"
                  onClick={() => navigate(`/admin/libros/editar/${book.id}`, { state: book })}
                >
                  Editar
                </button>
                <button className="hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => navigate("/admin/libros/agregar")}
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
      >
        Añadir libro
      </button>
    </div>
  );
};

export { BookList };
