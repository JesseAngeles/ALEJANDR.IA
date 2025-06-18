import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { AddDeliveryAddress } from "@/app/routes/address/AddDeliveryAddress";
import { addressService } from "@/app/domain/service/addressService";
import type { Address } from "@/assets/types/address";

const DeliveryAddress: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setPurchase } = usePurchase();

    const [addressList, setAddressList] = useState<Address[]>([]);

    // Cargar direcciones desde el servicio
    useEffect(() => {
        addressService.getAll().then(setAddressList);
    }, []);

    // Seleccionar dirección: ahora se envía el objeto completo
    const handleSelect = (selectedAddress: Address) => {
        setPurchase((prev) => ({ ...prev, address: selectedAddress }));
        navigate("/payment");
    };

    // Agregar nueva dirección al servicio y refrescar lista
    const handleAddAddress = async (address: Address) => {
        await addressService.add(address);
        const updated = await addressService.getAll();
        setAddressList(updated);
        navigate("/address");
    };

    // Mostrar formulario si se accede a /address/add
    if (location.pathname === "/address/add") {
        return <AddDeliveryAddress />;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Botón regresar */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            {/* Título */}
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Elige la dirección de entrega
            </h2>

            {/* Lista de direcciones */}
            <div className="space-y-4">
                {addressList.map((addr) => (
                    <div
                        key={addr._id}
                        className="border rounded bg-gray-50 p-4 flex justify-between items-start text-sm text-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelect(addr)} // Todo el cuadro es clickeable
                    >
                        <div>
                            <p className="font-semibold">{addr.name}</p>
                            <p className="text-gray-700">{`${addr.street} ${addr.number}, ${addr.zip_code}, ${addr.city}, ${addr.state}`}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita que el clic en "Editar" active el onClick del div
                                    navigate(`/address/edit/${addr._id}`);
                                }}
                                className="text-[#007B83] text-sm flex items-center gap-1 hover:underline"
                            >
                                <FaEdit className="text-xs" /> Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón agregar dirección */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate("/address/add", { state: { returnTo: "/address" } })}
                    className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                >
                    Agregar dirección
                </button>
            </div>
        </div>
    );
};

export { DeliveryAddress };
