// src/app/domain/service/userService.ts
import { apiFetch } from "@/app/utils/apiFetch";
import { string } from "zod";

const API = `${import.meta.env.VITE_ENDPOINT}/user`;
const VERIFY = `${import.meta.env.VITE_ENDPOINT}/verify`;

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
    },

    // Genera el token de verificación
    generateVerificationToken: async (email: string) => {
        return await apiFetch(VERIFY, {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },

    // Verifica la cuenta con token
    verifyAccountWithToken: async (email: string, token: string) => {
        return await apiFetch(VERIFY, {
            method: "PUT",
            body: JSON.stringify({ email, token }),
        });
    },
};
