// src/app/domain/service/orderService.ts
import { apiFetch } from "@/app/utils/apiFetch";
import type { OrderSummaryProps } from "@/assets/types/summary";

const API = "http://localhost:8080/order";

export const orderService = {
    // Crear una nueva orden
    sendOrder: async (summary: OrderSummaryProps): Promise<void> => {
        await apiFetch(API, {
            method: "POST",
            body: JSON.stringify(summary),
        });
    },

    // Obtener todas las órdenes (admin o sin rol en este caso)
    getAll: async () => {
        return await apiFetch(API);
    },

    // Obtener las órdenes del usuario autenticado
    getUserOrders: async () => {
        return await apiFetch(`${API}/user`);
    },

    // Obtener detalles de una orden específica
    getOrderDetails: async (orderId: string) => {
        return await apiFetch(`${API}/details/${orderId}`);
    },

    // Cambiar el estado de una orden (admin o sin rol)
    updateOrderStatus: async (orderId: string, newState: string) => {
        return await apiFetch(`${API}/state/${orderId}`, {
            method: "POST",
            body: JSON.stringify({ newState }),
        });
    },
};
