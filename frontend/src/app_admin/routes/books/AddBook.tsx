
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddBook: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        className="flex items-center text-sm text-black mb-6 hover:underline"
        onClick={() => navigate("/admin/libros")}
      >
        <FaArrowLeft className="mr-2" /> Regresar
      </button>

      <h2 className="text-2xl font-bold text-[#820000] mb-6">Añadir libro</h2>

      <form className="space-y-4">
        <input type="text" placeholder="Nombre del libro" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Autor" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="ISBN" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Categoría" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Editorial" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Año de edición" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Medidas" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Número de páginas" className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Encuadernación" className="w-full border rounded px-3 py-2" />
        <input type="file" className="w-full border rounded px-3 py-2" />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Añadir libro
        </button>
      </form>
    </div>
  );
};

export { AddBook };

