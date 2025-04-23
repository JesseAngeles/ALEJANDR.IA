import React from "react";
import type { PaymentMethod } from "@/assets/types/card";

type Props = {
    methods: PaymentMethod[];
    onSelect: (card: PaymentMethod) => void;
};

const PaymentMethods: React.FC<Props> = ({ methods, onSelect }) => {
    return (
        <div className="space-y-4">
            {methods.map((card) => (
                <div
                    key={card.id}
                    className="border rounded bg-gray-50 p-4 flex justify-between items-center text-sm"
                >
                    <div className="flex items-center gap-4">
                        <img src={card.logo} alt={card.brand} className="w-10 h-6" />
                        <div>
                            <p>
                                Ending in <span className="font-semibold">{card.last4}</span>
                            </p>
                            <p className="text-xs text-gray-600">{card.bank}</p>
                        </div>
                    </div>
                    <button
                        className="text-[#820000] font-semibold hover:underline"
                        onClick={() => onSelect(card)}
                    >
                        Select
                    </button>
                </div>
            ))}
        </div>
    );
};

export { PaymentMethods };
