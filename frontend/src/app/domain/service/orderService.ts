import { OrderSummaryProps } from "@/assets/types/summary";
import { apiFetch } from "@/app/utils/apiFetch"; // Importamos apiFetch

const API = "http://localhost:8080/order";

export const orderService = {
    // Enviar un nuevo pedido
    sendOrder: async (summary: OrderSummaryProps): Promise<any> => {
        const response = await apiFetch(`${API}`, {
            method: "POST",
            body: JSON.stringify(summary), // Pasa el resumen del pedido
        });

        return response;
    },

    getUserOrders: async (): Promise<any[]> => {
        const response = await apiFetch(`${API}/user`, {
            method: "GET",
        });

        return response;
    },

    getOrderDetails: async (orderId: string): Promise<any> => {
        const response = await apiFetch(`${API}/details/${orderId}`, {
            method: "GET",
        });

        return response;
    },
};
