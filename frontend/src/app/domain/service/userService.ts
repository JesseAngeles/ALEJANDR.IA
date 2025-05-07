// src/app/domain/service/userService.ts
import { apiFetch } from "@/app/utils/apiFetch";

const API = "http://localhost:8080/user";

export const userService = {
    get: async () => {
        return await apiFetch(API);
    },
    update: async (data: { name: string; email: string }) => {
        return await apiFetch(API, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
};
