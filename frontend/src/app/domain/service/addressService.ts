// src/app/domain/services/addressService.ts
import type { Address } from "@/assets/types/address";
import { addresses as initialData } from "@/assets/data/addresses";

let addressStorage: Address[] = [];

export const addressService = {
    getAll: async (): Promise<Address[]> => {
        if (addressStorage.length === 0) {
            addressStorage = [...initialData];
        }
        return addressStorage;
    },

    add: async (address: Address): Promise<void> => {
        addressStorage.push(address);
    },

    update: async (updated: Address): Promise<void> => {
        addressStorage = addressStorage.map((a) =>
            a.id === updated.id ? updated : a
        );
    },

    remove: async (id: number): Promise<void> => {
        addressStorage = addressStorage.filter((a) => a.id !== id);
    },

    resetMock: (data: Address[]) => {
        addressStorage = [...data];
    },
};
