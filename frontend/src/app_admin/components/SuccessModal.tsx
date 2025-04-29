import React from "react";

type SuccessModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow text-center">
        <h2 className="text-lg font-bold mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export { SuccessModal };
