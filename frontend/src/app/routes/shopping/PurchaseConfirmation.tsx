import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usePurchase } from "@/app/domain/context/PurchaseContext";

const PurchaseConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const { setPurchase } = usePurchase();

    const handleReturnHome = () => {
        // Limpia los datos del pedido
        setPurchase({
            cart: [],
            address: null,
            paymentMethod: null,
            cvc: "",
        });
        navigate("/");
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#007B83] mb-2">Purchase Successful!</h2>
            <p className="text-gray-700 mb-6">
                Thank you for your order. A confirmation email has been sent. Your books will arrive soon.
            </p>
            <button
                onClick={handleReturnHome}
                className="bg-[#007B83] hover:bg-[#6d0000] text-white px-6 py-2 rounded"
            >
                Return to Home
            </button>
        </div>
    );
};

export { PurchaseConfirmation };
