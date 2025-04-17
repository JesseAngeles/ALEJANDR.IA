import type { OrderSummaryProps } from "@/assets/types/summary";

export const orderService = {
    sendOrder: async (summary: OrderSummaryProps): Promise<void> => {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(summary),
        });

        /*if (!response.ok) {
            throw new Error("Error al guardar el pedido.");
        }*/
    },
};
