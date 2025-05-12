import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { useOrder } from "@/app/domain/context/OrderContext"; // Usar el contexto
import { paymentService } from "@/app/domain/service/paymentService"; // Importar el servicio de tarjetas
import { addressService } from "@/app/domain/service/addressService"; // Importar el servicio de direcciones

const OrderDetails: React.FC = () => {
    const { selectedOrder } = useOrder(); // Obtener la orden seleccionada del contexto
    const [card, setCard] = useState<any | null>(null);
    const [address, setAddress] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdditionalDetails = async () => {
            if (!selectedOrder) return; // Si no hay orden seleccionada, no hacer nada

            try {
                console.log(selectedOrder)
                // Obtener los detalles de la tarjeta
                const cardDetails = await paymentService.getById(selectedOrder.card);
                setCard(cardDetails);

                // Obtener los detalles de la dirección
                const addressDetails = await addressService.getById(selectedOrder.direction);
                setAddress(addressDetails);
            } catch (error) {
                console.error("Error al obtener los detalles adicionales:", error);
            }
        };

        fetchAdditionalDetails();
    }, [selectedOrder]); // Solo se ejecuta cuando se selecciona una nueva orden

    // Verificación si no hay datos en la orden
    if (!selectedOrder || !card || !address) {
        return <div>Cargando...</div>; // O podrías mostrar un mensaje de error
    }
    console.log(card)
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Regresar */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <h2 className="text-2xl font-bold text-[#820000] mb-6">Detalles de la Orden</h2>

            {/* Información general */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#820000]">
                        Pedido #{Math.floor(parseFloat(selectedOrder._id))}
                    </h3>
                    <span className="text-sm text-gray-500">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                    <p className="text-gray-600">
                        Estado: <span className="font-semibold">{selectedOrder.state}</span>
                    </p>
                    <p className="text-gray-600">Total: ${selectedOrder.total.toFixed(2)}</p>
                    <p className="text-gray-600">Número de productos: {selectedOrder.noItems}</p>
                </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Dirección de Envío</h3>
                <p className="text-sm text-gray-600">
                    {address?.name} — {`${address?.street} ${address?.number}, ${address?.zip_code}, ${address?.city}, ${address?.state}`}
                </p>
            </div>

            {/* Forma de pago */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Forma de Pago</h3>
                <div className="flex items-center gap-4">
                    <img
                        src={getCardLogo(card?.type)}
                        alt={card?.type}
                        className="w-10 h-6"
                    />
                    <span className="text-sm font-medium">
                        Terminada en {card?.last4} ({card?.type})
                    </span>
                </div>
            </div>

            {/* Productos */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Productos</h3>
                <ul className="space-y-4 mt-4">
                    {selectedOrder.items.map((item: any) => (
                        <li key={item._id} className="flex items-center justify-between gap-4 border-b pb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.bookId.image}
                                    alt={item.bookId.title}
                                    className="w-12 h-16 object-cover rounded"
                                />
                                <div>
                                    <p className="font-medium text-sm">{item.bookId.title}</p>
                                    <p className="text-xs text-gray-500">{item.bookId.author}</p>
                                    <p className="text-xs text-gray-600">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-sm font-medium">
                                {/* Verificación para evitar el error de undefined */}
                                <p>${item.bookId.price ? item.bookId.price.toFixed(2) : "N/A"}</p>
                                <p className="text-[#007B83]">
                                    {item.bookId.price && item.quantity
                                        ? (item.bookId.price * item.quantity).toFixed(2)
                                        : "N/A"}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export { OrderDetails };
