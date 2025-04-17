import React from "react";
import { CvcForm } from "@/app/routes/payment/CvcForm";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { useNavigate } from "react-router-dom";

const Cvc: React.FC = () => {
    const { purchase, setPurchase } = usePurchase();
    const navigate = useNavigate();

    const handleContinue = (cvc: string) => {
        setPurchase((prev) => ({ ...prev, cvc }));
        navigate("/summary");
    };

    if (!purchase.paymentMethod) {
        return <p>No payment method selected.</p>;
    }

    return <CvcForm card={purchase.paymentMethod} onContinue={handleContinue} />;
};

export { Cvc };
