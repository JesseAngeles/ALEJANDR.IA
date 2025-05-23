import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7] text-center">
            <div className="bg-[#820000] text-white p-8 rounded-lg shadow-xl mb-6">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Página No Encontrada</h2>
                <p className="text-sm text-gray-200">Lo sentimos, la página que buscas no está disponible.</p>
            </div>

            <button
                onClick={() => navigate("/")}
                className="mt-4 py-2 px-6 text-white bg-[#007B83] hover:bg-[#005f63] rounded-full flex items-center gap-2"
            >
                <FaArrowLeft className="text-xl" />
                Regresar al inicio
            </button>
        </div>
    );
};

export { NotFound };
