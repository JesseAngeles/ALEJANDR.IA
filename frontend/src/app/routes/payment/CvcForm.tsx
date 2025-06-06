import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PaymentMethod } from "@/assets/types/card";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { useNavigate } from "react-router-dom";

type Props = {
    card: PaymentMethod;
    onContinue: (cvc: string) => void;
};

const CvcForm: React.FC<Props> = ({ card, onContinue }) => {
    const [cvc, setCvc] = useState("");
    const [error, setError] = useState(""); // 👈 nuevo estado de error

    const handleContinue = () => {
        if (cvc.length >= 3) {
            setError(""); // limpia error si es válido
            onContinue(cvc);
        } else {
            setError("Por favor ingresa un CVC válido de al menos 3 dígitos.");
        }
    };

    const navigate = useNavigate();

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Elige tu forma de pago
            </h2>

            <div className="bg-white shadow-md border rounded px-6 py-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-sm text-black mb-4 hover:underline">
                    <FaArrowLeft className="mr-2" />
                    Regresar
                </button>

                <h3 className="text-lg font-bold mb-2">Ingresa el código de seguridad</h3>

                <div className="flex items-center mb-4 gap-2">
                    <img src={getCardLogo(card.type)} alt={card.type} className="w-10 h-6" />
                    <div>
                        <p className="text-sm">
                            Terminada en <span className="font-semibold">{card.last4}</span>
                        </p>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <img src="/src/assets/icons/cvc.webp" alt="CVC location on card" className="w-40 h-auto" />
                </div>

                <div className="text-center mb-2">
                    <input
                        type="text"
                        placeholder="CVC"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className={`border rounded px-4 py-2 text-center w-24 ${error ? "border-red-500" : "border-black"}`}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 text-center mb-4">{error}</p>
                )}

                <div className="text-center">
                    <button
                        onClick={handleContinue}
                        className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export { CvcForm };
