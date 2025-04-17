import React from "react";
import type { PaymentMethod } from "@/assets/types/card";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { Link, useNavigate } from "react-router-dom";
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
                    key={card.id}
                    className="border rounded bg-gray-50 p-4 flex justify-between items-center text-sm"
                >
                    <div className="flex items-center gap-4">
                        <img src={getCardLogo(card.brand)} alt={card.brand} className="w-10 h-6" />
                        <div>
                            <p>
                                Terminada en <span className="font-semibold">{card.last4}</span>
                            </p>
                            <p className="text-xs text-gray-600">{card.bank}</p>
                        </div>
                    </div>
                    <button
                        className="text-[#820000] font-semibold hover:underline"
                        onClick={() => onSelect(card)}
                    >
                        Seleccionar
                    </button>
                </div>
            ))}
        </div>
    );
};

export { PaymentMethods };
