export type PaymentMethod = {
    _id: number;
    titular: string;
    last4: string;
    expirationMonth: number;
    expirationYear: number;
    type: "VISA" | "MasterCard";
};
