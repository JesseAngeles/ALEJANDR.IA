// src/assets/types/order.ts
import { CartItem } from "./cart";

export type Order = {
    _id: string;
    date: Date;
    client: string;
    total: number;
    state: string;
    items: CartItem[];
    noItems: number;
};
