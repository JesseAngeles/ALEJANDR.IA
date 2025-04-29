import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Book } from "@/assets/types/book";
import type { Address } from "@/assets/types/address";
import type { PaymentMethod } from "@/assets/types/card";

type PurchaseData = {
    cart: Book[];
    address: Address | null;
    paymentMethod: PaymentMethod | null;
    cvc: string;
};

type PurchaseContextType = {
    purchase: PurchaseData;
    setPurchase: React.Dispatch<React.SetStateAction<PurchaseData>>;
    resetPurchase: () => void;
};

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const usePurchase = (): PurchaseContextType => {
    const context = useContext(PurchaseContext);
    if (!context) {
        throw new Error("usePurchase must be used within a PurchaseProvider");
    }
    return context;
};

type Props = {
    children: ReactNode;
};

export const PurchaseProvider: React.FC<Props> = ({ children }) => {
    const [purchase, setPurchase] = useState<PurchaseData>({
        cart: [],
        address: null,
        paymentMethod: null,
        cvc: "",
    });

    const resetPurchase = () => {
        setPurchase({
            cart: [],
            address: null,
            paymentMethod: null,
            cvc: "",
        });
    };

    return (
        <PurchaseContext.Provider value={{ purchase, setPurchase, resetPurchase }}>
            {children}
        </PurchaseContext.Provider>
    );
};
