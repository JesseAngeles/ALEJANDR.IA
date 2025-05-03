import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { Address } from "@/assets/types/address";
import { addressService } from "@/app/domain/service/addressService";

const AddDeliveryAddress: React.FC = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [street, setStreet] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zip_code, setZipCode] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !number || !street || !state || !city || !zip_code) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const newAddress = {
            name,
            number,
            street,
            state,
            city,
            zip_code: parseInt(zip_code),
        };

        try {
            await addressService.add(newAddress as Address);
            navigate("/address");
        } catch (error) {
            console.error("Error al agregar dirección:", error);
            alert("No se pudo guardar la dirección.");
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
                Agregar dirección de envío
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Nombre de referencia:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Número:</label>
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Calle:</label>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm mb-1">Estado:</label>
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="border rounded w-full p-2"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm mb-1">Municipio:</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border rounded w-full p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1">Código postal:</label>
                    <input
                        type="text"
                        value={zip_code}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                        maxLength={5}
                        className="border rounded w-24 p-2"
                    />
                </div>

                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                    >
                        Agregar
                    </button>
                </div>
            </form>
        </div>
    );
};

export { AddDeliveryAddress };
