import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const EditBook: React.FC = () => {
  const navigate = useNavigate();
  const { state: book } = useLocation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        className="flex items-center text-sm text-[#820000] mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
      </button>
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Editar libro</h2>
      <form className="space-y-4">
        <input type="text" defaultValue={book?.title} className="w-full border rounded px-3 py-2" />
        <input type="text" defaultValue={book?.author} className="w-full border rounded px-3 py-2" />
        <input type="text" defaultValue={book?.isbn} className="w-full border rounded px-3 py-2" />
        <input type="number" defaultValue={book?.price} className="w-full border rounded px-3 py-2" />
        <input type="number" defaultValue={book?.stock} className="w-full border rounded px-3 py-2" />
        <input type="file" className="w-full border rounded px-3 py-2" />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export { EditBook };
