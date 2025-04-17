import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { PaymentMethod } from "@/assets/types/card";
import { paymentService } from "@/app/domain/service/paymentService";

const AddPaymentMethod: React.FC = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !number || !expiry) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const last4 = number.slice(-4);
        const brand = number.startsWith("5") ? "MasterCard" : "VISA";

        const newMethod: PaymentMethod = {
            id: Date.now(),
            brand,
            last4,
            bank: "Banco genérico", // puedes reemplazar con input más adelante
        };

        await paymentService.add(newMethod);
        navigate("/payment");
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <h2 className="text-lg font-semibold text-[#820000] mb-6">
                Agregar método de pago
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">
                        Nombre como aparece en la tarjeta:
                    </label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Número de la tarjeta:</label>
                    <input
                        type="text"
                        maxLength={16}
                        className="border rounded w-full p-2"
                        value={number}
                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Fecha de vencimiento:</label>
                    <input
                        type="text"
                        placeholder="mm/aa"
                        className="border rounded p-2 w-24"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                    />
                </div>

                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="bg-[#007B83] text-white px-6 py-2 rounded hover:bg-[#00666e]"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>
    );
};

export { AddPaymentMethod };
