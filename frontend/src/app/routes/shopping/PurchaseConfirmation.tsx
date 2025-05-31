import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { usePurchase } from "@/app/domain/context/PurchaseContext";

export const PurchaseConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setPurchase } = usePurchase();

    const orderId = location.state?.orderId;

    return (
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#007B83] mb-2">¡Compra confirmada!</h2>
            <p className="text-gray-700 mb-4">
                Gracias por su compra. Un correo de confirmación fue enviado.
            </p>

            {orderId && (
                <p className="text-sm text-gray-600 mb-6">
                    <span className="font-semibold">ID del pedido:</span>{' '}
                    <span className="bg-gray-100 text-[#007B83] font-mono px-2 py-1 rounded">
                        {orderId.slice(-8)}
                    </span>
                </p>
            )}

            <div className="flex flex-col items-center gap-3 mt-6">
                <button
                    onClick={() => navigate("/account/history")}
                    className="bg-[#007B83] hover:bg-[#6d0000] text-white px-6 py-2 rounded w-full max-w-xs"
                >
                    Ver mis pedidos
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="bg-[#007B83] hover:bg-[#6d0000] text-white px-6 py-2 rounded w-full max-w-xs"
                >
                    Regresar al inicio
                </button>
            </div>
        </div>
    );
};
