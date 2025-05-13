import { apiFetch } from "@/app/utils/apiFetch";
import { string } from 'zod';

const API = `${import.meta.env.VITE_ENDPOINT}/restore`;

export const passwordService = {

    getToken: async (data: { email: string }) => {
        return await apiFetch(API, {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    update: async (data: { email: string; token: string; newPassword: string }) => {
        return await apiFetch(API, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }
};