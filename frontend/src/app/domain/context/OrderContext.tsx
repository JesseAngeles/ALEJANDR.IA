import React, { createContext, useContext, useState } from 'react';

type OrderContextType = {
    selectedOrder: any | null;
    setSelectedOrder: (order: any) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    return (
        <OrderContext.Provider value={{ selectedOrder, setSelectedOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used within an OrderProvider');
    return context;
};
