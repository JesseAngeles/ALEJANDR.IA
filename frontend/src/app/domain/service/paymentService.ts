// src/app/domain/services/paymentService.ts
import type { PaymentMethod } from "@/assets/types/card";

let paymentStorage: PaymentMethod[] = [];

export const paymentService = {
    getAll: async (): Promise<PaymentMethod[]> => {
        return paymentStorage;
    },

    add: async (method: PaymentMethod): Promise<void> => {
        paymentStorage.push(method);
    },

    remove: async (id: number): Promise<void> => {
        paymentStorage = paymentStorage.filter((m) => m.id !== id);
    },

    resetMock: (data: PaymentMethod[]) => {
        paymentStorage = [...data];
    },
};
