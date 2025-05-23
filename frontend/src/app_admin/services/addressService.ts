import type { Address } from "@/assets/types/address";
import { apiFetch } from "@/app/utils/apiFetch";

const API = `${import.meta.env.VITE_ENDPOINT}/user/direction`;

export const addressService = {
    getAll: async (): Promise<Address[]> => {
        return await apiFetch(API);
    },

    add: async (address: Address): Promise<void> => {
        await apiFetch(API, {
            method: "POST",
            body: JSON.stringify(address),
        });
    },

    update: async (address: Address): Promise<void> => {
        await apiFetch(`${API}/${address._id}`, {
            method: "PUT",
            body: JSON.stringify(address),
        });
    },

    remove: async (id: string): Promise<void> => {
        await apiFetch(`${API}/${id}`, {
            method: "DELETE",
        });
    },

    // Nuevo método para obtener una dirección por su ID
    getById: async (id: string): Promise<Address> => {
        return await apiFetch(`${API}/${id}`);
    },
};