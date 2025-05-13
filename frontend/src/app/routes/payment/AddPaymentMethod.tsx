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
    const [successMessage, setSuccessMessage] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        if (!titular.trim()) newErrors.titular = "Este campo es obligatorio";
        if (!number.match(/^\d{16}$/)) newErrors.number = "Debe tener 16 dígitos";
        if (!expirationMonth.match(/^(0?[1-9]|1[0-2])$/)) newErrors.expirationMonth = "Mes inválido";
        if (!expirationYear.match(/^\d{4}$/) || parseInt(expirationYear) < new Date().getFullYear()) {
            newErrors.expirationYear = "Año inválido";
        }
        if (!securityCode.match(/^\d{3,4}$/)) newErrors.securityCode = "CVV inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) return;

        const newMethod = {
            titular,
            number,
            expirationMonth: parseInt(expirationMonth),
            expirationYear: parseInt(expirationYear),
            securityCode,
        };

        try {
            await paymentService.add(newMethod as any);
            setSuccessMessage(true);
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
                    <label className="block text-sm mb-1">Nombre del titular:</label>
                    <input
                        type="text"
                        value={titular}
                        onChange={(e) => setTitular(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                    {errors.titular && <p className="text-red-600 text-sm mt-1">{errors.titular}</p>}
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
                    {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number}</p>}
                </div>

                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm mb-1">Mes:</label>
                        <input
                            type="text"
                            maxLength={2}
                            value={expirationMonth}
                            onChange={(e) => setExpirationMonth(e.target.value.replace(/\D/g, ""))}
                            className="border rounded p-2 w-20"
                        />
                        {errors.expirationMonth && <p className="text-red-600 text-sm">{errors.expirationMonth}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Año:</label>
                        <input
                            type="text"
                            maxLength={4}
                            value={expirationYear}
                            onChange={(e) => setExpirationYear(e.target.value.replace(/\D/g, ""))}
                            className="border rounded p-2 w-24"
                        />
                        {errors.expirationYear && <p className="text-red-600 text-sm">{errors.expirationYear}</p>}
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
                    {errors.securityCode && <p className="text-red-600 text-sm">{errors.securityCode}</p>}
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

            {successMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
                        <p className="text-[#00000] font-semibold mb-4">
                            Método de pago agregado correctamente
                        </p>
                        <button
                            onClick={() => {
                                setSuccessMessage(false);
                                navigate("/payment");
                            }}
                            className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AddPaymentMethod };
