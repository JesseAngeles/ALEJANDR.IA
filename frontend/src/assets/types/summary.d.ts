// src/assets/types/summary.ts
import type { Book } from "./book";
import type { Address } from "./address";
import type { PaymentMethod } from "./card";

export type OrderSummaryProps = {
    cart: Book[];
    address: Address;
    paymentMethod: PaymentMethod;
    totalItems: number;
    total: number;
};
