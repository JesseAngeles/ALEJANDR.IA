import type { PaymentMethod } from "@/assets/types/card";
import { apiFetch } from "@/app/utils/apiFetch";

const API = "http://localhost:8080/user/card";

export const paymentService = {
    getAll: async (): Promise<PaymentMethod[]> => {
        return await apiFetch(API);
    },

    add: async (method: PaymentMethod): Promise<void> => {
        await apiFetch(API, {
            method: "POST",
            body: JSON.stringify(method),
        });
    },

    remove: async (id: string): Promise<void> => {
        await apiFetch(`${API}/${id}`, {
            method: "DELETE",
        });
    },
};
