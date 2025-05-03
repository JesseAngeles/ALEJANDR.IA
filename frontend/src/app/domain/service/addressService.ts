import type { Address } from "@/assets/types/address";
import { apiFetch } from "@/app/utils/apiFetch";

const API = "http://localhost:8080/user/direction";

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
};
