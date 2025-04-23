import { PaymentMethod } from "./card";

export type OrderSummaryProps = {
    totalItems: number;
    address: string;
    paymentMethod: PaymentMethod;
    total: number;
};
