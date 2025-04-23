import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book } from "@/assets/types/book";
import { PaymentMethod } from "@/assets/types/card";

type PurchaseData = {
    cart: Book[];
    address: string;
    paymentMethod: PaymentMethod | null;
    cvc: string;
};

type PurchaseContextType = {
    purchase: PurchaseData;
    setPurchase: React.Dispatch<React.SetStateAction<PurchaseData>>;
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
        address: "",
        paymentMethod: null,
        cvc: "",
    });

    return (
        <PurchaseContext.Provider value={{ purchase, setPurchase }}>
            {children}
        </PurchaseContext.Provider>
    );
};
