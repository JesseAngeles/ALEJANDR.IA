import { OrderSummaryProps } from "@/assets/types/summary";
import { apiFetch } from "@/app/utils/apiFetch";

const API = `${import.meta.env.VITE_ENDPOINT}/order`;

export const orderService = {
    // Enviar un nuevo pedido
    sendOrder: async (summary: OrderSummaryProps): Promise<any> => {
        const response = await apiFetch(`${API}`, {
            method: "POST",
            body: JSON.stringify(summary),
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

    cancelOrder: async (orderId: string): Promise<any> => {
        const response = await apiFetch(`${API}/cancel/${orderId}`, {
            method: "POST",
        });
        return response;
    },

    returnOrder: async (orderId: string): Promise<any> => {
        const response = await apiFetch(`${API}/return/${orderId}`, {
            method: "POST",
        });
        return response;
    },
};
