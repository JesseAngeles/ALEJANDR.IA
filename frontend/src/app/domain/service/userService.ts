// src/app/domain/service/userService.ts
import { apiFetch } from "@/app/utils/apiFetch";
import { string } from "zod";

const API = `${import.meta.env.VITE_ENDPOINT}/user`;

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

    updatePassword: async (data: { password: string; newPassword: string }) => {
        return await apiFetch(`${API}/pass`, {
            method: "POST",
            body: JSON.stringify(data)
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
