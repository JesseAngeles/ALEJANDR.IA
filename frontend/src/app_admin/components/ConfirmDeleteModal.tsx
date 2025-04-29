import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  book: {
    title: string;
    author: string;
    isbn: string;
    stock: number;
  } | null;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onCancel, onConfirm, book }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow text-center">
        {/* Cancelar con flecha */}
        <button
          onClick={onCancel}
          className="text-[#000000] flex items-center mb-4 hover:underline text-sm"
        >
          <FaArrowLeft className="mr-2 text-lg" /> Cancelar
        </button>

        {/* Mensaje */}
        <h2 className="text-lg font-bold mb-2">
          ¿Deseas eliminar el siguiente libro?
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Se borrará toda la información relacionada con el mismo.
        </p>

        {/* Datos */}
        <div className="text-left mb-6 space-y-1 text-sm">
          <p><span className="font-semibold">Título:</span> {book.title}</p>
          <p><span className="font-semibold">Autor:</span> {book.author}</p>
          <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
          <p><span className="font-semibold">Stock:</span> {book.stock}</p>
        </div>

        <button
          onClick={onConfirm}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export { ConfirmDeleteModal };
