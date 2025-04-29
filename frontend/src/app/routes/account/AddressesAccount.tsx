import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar"
import { addressService } from "@/app/domain/service/addressService";
import type { Address } from "@/assets/types/address";

const AddressesAccount: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        const data = await addressService.getAll();
        setAddresses(data);
    };

    const handleRemove = async (id: number) => {
        await addressService.remove(id);
        loadAddresses();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <AccountSidebar />

                {/* Content */}
                <section className="flex-1">
                    <h2 className="text-2xl font-bold text-[#820000] mb-6">Mis direcciones de envío</h2>

                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className="flex justify-between items-center bg-gray-50 border rounded px-4 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-semibold">{addr.referenceName}</p>
                                    <p className="text-sm text-gray-700">{addr.fullAddress}</p>
                                </div>

                                <button
                                    onClick={() => handleRemove(addr.id)}
                                    className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                                >
                                    <FaTrash className="text-xs" /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate("/address/add")}
                            className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                        >
                            Agregar nueva dirección
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export { AddressesAccount };
