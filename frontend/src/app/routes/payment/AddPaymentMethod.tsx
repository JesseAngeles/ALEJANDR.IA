import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { paymentService } from "@/app/domain/service/paymentService";

const AddPaymentMethod: React.FC = () => {
    const [titular, setTitular] = useState("");
    const [number, setNumber] = useState("");
    const [expirationMonth, setExpirationMonth] = useState("");
    const [expirationYear, setExpirationYear] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titular || !number || !expirationMonth || !expirationYear || !securityCode) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const newMethod = {
            titular,
            number,
            expirationMonth: parseInt(expirationMonth),
            expirationYear: parseInt(expirationYear),
            securityCode,
        };

        try {
            await paymentService.add(newMethod as any);
            navigate("/payment");
        } catch (error) {
            console.error("Error al guardar método de pago:", error);
            alert("No se pudo agregar el método de pago.");
        }
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
                        Nombre del titular:
                    </label>
                    <input
                        type="text"
                        value={titular}
                        onChange={(e) => setTitular(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Número de tarjeta:</label>
                    <input
                        type="text"
                        maxLength={16}
                        value={number}
                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm mb-1">Mes:</label>
                        <input
                            type="number"
                            min={1}
                            max={12}
                            value={expirationMonth}
                            onChange={(e) => setExpirationMonth(e.target.value)}
                            className="border rounded p-2 w-20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Año:</label>
                        <input
                            type="number"
                            min={2024}
                            value={expirationYear}
                            onChange={(e) => setExpirationYear(e.target.value)}
                            className="border rounded p-2 w-24"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">Código de seguridad (CVV):</label>
                    <input
                        type="text"
                        maxLength={4}
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, ""))}
                        className="border rounded p-2 w-24"
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
