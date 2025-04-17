import React, { useState } from "react";
import { PaymentMethods } from "@/app/routes/payment/PaymentMethods";
import { paymentMethods as initialMethods } from "@/assets/data/cards";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { PaymentMethod } from "@/assets/types/card";
import { Link } from "react-router-dom";

const Payment: React.FC = () => {
    const { setPurchase } = usePurchase();
    const navigate = useNavigate();
    const location = useLocation();

    const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

    const handleSelect = (card: PaymentMethod) => {
        setPurchase((prev) => ({ ...prev, paymentMethod: card }));
        navigate("/cvc");
    };

    const handleAddMethod = (newCard: PaymentMethod) => {
        setMethods((prev) => [...prev, newCard]);
        navigate("/payment");
    };

    // Soporte para redireccionar desde /payment/add
    if (location.pathname === "/payment/add") {
        const AddPaymentMethod = require("./AddPaymentMethod").default;
        return <AddPaymentMethod onAdd={handleAddMethod} />;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Choose your payment method
            </h2>

            <PaymentMethods methods={methods} onSelect={handleSelect} />

            <div className="text-center mt-6">
                <Link
                    to="/payment/add"
                    className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded inline-block"
                >
                    Agregar método de pago
                </Link>
            </div>
        </div>
    );
};

export { Payment };
