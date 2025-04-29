import React from "react";
import { OrderSummary } from "@/app/routes/shopping/OrderSummary";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import type { OrderSummaryProps } from "@/assets/types/summary";

const Summary: React.FC = () => {
    const { purchase } = usePurchase();

    console.log("📦 purchase state:", purchase);

    if (
        !purchase.paymentMethod ||
        !purchase.address ||
        !purchase.cart.length
    ) {
        return (
            <p className="text-center text-red-500">
                Incomplete order data.
            </p>
        );
    }

    const total = purchase.cart.reduce(
        (acc, book) => acc + book.precio * book.cantidad,
        0
    );

    const totalItems = purchase.cart.reduce(
        (acc, book) => acc + book.cantidad,
        0
    );

    const summary: OrderSummaryProps = {
        cart: purchase.cart,                   // ✅ carrito completo
        address: purchase.address,            // ✅ objeto Address completo
        paymentMethod: purchase.paymentMethod,
        totalItems,
        total,
    };

    return <OrderSummary summary={summary} />;
};

export { Summary };
