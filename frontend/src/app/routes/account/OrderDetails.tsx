import React, { useEffect, useState } from "react";
import { orderService } from "@/app/domain/service/orderService";
import { paymentService } from "@/app/domain/service/paymentService"; // Importar el servicio de tarjetas
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getCardLogo } from "@/app/utils/getCardLogo";

const OrderDetails: React.FC = () => {
    const [order, setOrder] = useState<any | null>(null);
    const [card, setCard] = useState<any | null>(null);
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;

            try {
                const orderDetails = await orderService.getOrderDetails(orderId);
                setOrder(orderDetails);

                // Obtener los detalles de la tarjeta
                const cardDetails = await paymentService.getById(orderDetails.card);
                setCard(cardDetails);
            } catch (error) {
                console.error("Error al obtener los detalles de la orden:", error);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (!order || !card) {
        return <div>Cargando...</div>;
    }

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
                    <h3 className="text-xl font-semibold text-[#820000]">Pedido #{Math.floor(parseFloat(order._id))}</h3>
                    <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                    <p className="text-gray-600">
                        Estado: <span className="font-semibold">{order.state}</span>
                    </p>
                    <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
                    <p className="text-gray-600">Número de productos: {order.noItems}</p>
                </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Dirección de Envío</h3>
                <p className="text-sm text-gray-600">{order.direction}</p>
            </div>

            {/* Forma de pago */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Forma de Pago</h3>
                <div className="flex items-center gap-4">
                    <img
                        src={getCardLogo(card.brand)} // Usamos el brand para obtener el logo
                        alt={card.brand}
                        className="w-10 h-6"
                    />
                    <span className="text-sm font-medium">
                        Terminada en {card.last4} ({card.brand})
                    </span>
                </div>
            </div>

            {/* Productos */}
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Productos</h3>
                <ul className="space-y-4 mt-4">
                    {order.items.map((item: any) => (
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
                                <p>${item.bookId.price.toFixed(2)}</p>
                                <p className="text-[#007B83]">
                                    ${(item.bookId.price * item.quantity).toFixed(2)}
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
