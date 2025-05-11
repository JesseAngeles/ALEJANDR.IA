// src/app/domain/service/userService.ts
import { apiFetch } from "@/app/utils/apiFetch";

const API = "http://localhost:8080/user";

export const userService = {
    get: async () => {
        return await apiFetch(API);
    },

    update: async (data: { name: string; email: string; password: string }) => {
        return await apiFetch(API, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    post: async (data: { name: string; email: string; password: string }) => {
        const payload = {
            ...data,
            active: true,
        };

        return await apiFetch(API, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }
};
