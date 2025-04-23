import React from "react";
import { PaymentMethods } from "@/app/routes/shopping/PaymentMethods";
import { paymentMethods } from "@/assets/data/cards";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { useNavigate } from "react-router-dom";

const Payment: React.FC = () => {
    const { setPurchase } = usePurchase();
    const navigate = useNavigate();

    const handleSelect = (card: typeof paymentMethods[number]) => {
        setPurchase((prev) => ({ ...prev, paymentMethod: card }));
        navigate("/cvc");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Choose your payment method
            </h2>
            <PaymentMethods methods={paymentMethods} onSelect={handleSelect} />
        </div>
    );
};

export { Payment };
