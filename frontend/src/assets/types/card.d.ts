export type PaymentMethod = {
    id: number;
    brand: "VISA" | "MasterCard";
    last4: string;
    bank: string;
};
