import React from "react";

const BestSellers: React.FC = () => {
  const books = [
    { title: "Un fuego azul", author: "Pedro Feijoo", sold: 123 },
    { title: "Eres todo para mí", author: "Sylvia Day", sold: 117 },
    { title: "Río Bravo", author: "Julio Vaquero", sold: 110 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Libros más vendidos</h2>
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
              <td className="p-2">{book.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { BestSellers };
