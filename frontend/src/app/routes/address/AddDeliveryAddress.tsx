import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { Address } from "@/assets/types/address";
import { addressService } from "@/app/domain/service/addressService";

const AddDeliveryAddress: React.FC = () => {
    const [referenceName, setReferenceName] = useState("");
    const [street, setStreet] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!referenceName || !street || !state || !city || !zip) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const fullAddress = `${street}, ${city}, ${state}, CP ${zip}`;
        const newAddress: Address = {
            id: Date.now(),
            referenceName,
            street,
            state,
            city,
            zip,
            fullAddress,
        };

        await addressService.add(newAddress);
        navigate("/address");
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
                        value={referenceName}
                        onChange={(e) => setReferenceName(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Calle y número:</label>
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
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
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
