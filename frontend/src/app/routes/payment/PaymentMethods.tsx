import React from "react";
import type { PaymentMethod } from "@/assets/types/card";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
    methods: PaymentMethod[];
    onSelect: (card: PaymentMethod) => void;
};

const PaymentMethods: React.FC<Props> = ({ methods, onSelect }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            {/* Botón regresar */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            {methods.map((card) => (
                <div
                    key={card._id}
                    className="border rounded bg-gray-50 p-4 flex justify-between items-center text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelect(card)}
                >
                    <div className="flex items-center gap-4">
                        <img src={getCardLogo(card.type)} alt={card.type} className="w-10 h-6" />
                        <div>
                            <p>
                                Terminada en <span className="font-semibold">{card.last4}</span>
                            </p>
                            <p className="text-xs text-gray-600">
                                {card.titular} — expira {card.expirationMonth}/{card.expirationYear}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { PaymentMethods };
