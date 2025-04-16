import React from "react";
import { OrderSummary } from "@/app/routes/shopping/OrderSummary";
import { usePurchase } from "@/app/domain/context/PurchaseContext";

const Summary: React.FC = () => {
    const { purchase } = usePurchase();

    if (!purchase.paymentMethod || !purchase.address || !purchase.cart.length) {
        return <p className="text-center text-red-500">Incomplete order data.</p>;
    }

    const total = purchase.cart.reduce(
        (acc, book) => acc + book.precio * book.cantidad,
        0
    );

    const summary = {
        totalItems: purchase.cart.reduce((acc, book) => acc + book.cantidad, 0),
        address: purchase.address,
        paymentMethod: purchase.paymentMethod,
        total,
    };

    return <OrderSummary summary={summary} />;
};

export { Summary };
