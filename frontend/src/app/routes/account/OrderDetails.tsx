import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { useOrder } from "@/app/domain/context/OrderContext";
import { paymentService } from "@/app/domain/service/paymentService";
import { addressService } from "@/app/domain/service/addressService";
import { cartService } from "@/app/domain/service/cartService";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const OrderDetails: React.FC = () => {
    const { selectedOrder, setSelectedOrder } = useOrder(); // Incluye setter del contexto
    const [card, setCard] = useState<any | null>(null);
    const [address, setAddress] = useState<any | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdditionalDetails = async () => {
            if (!selectedOrder) return;

            try {
                const [cardDetails, addressDetails, itemDetails] = await Promise.all([
                    paymentService.getById(selectedOrder.card),
                    addressService.getById(selectedOrder.direction),
                    Promise.all(
                        selectedOrder.items.map(async (item: any) => {
                            const book = await cartService.getBookById(item.bookId);
                            return { ...item, book };
                        })
                    )
                ]);

                setCard(cardDetails);
                setAddress(addressDetails);
                setItems(itemDetails);

                // WebSocket: Escuchar actualizaciones de estado
                const channel = `orderStatus:${selectedOrder._id}`;
                socket.on(channel, (data: { state: string }) => {
                    console.log(`📦 Estado actualizado en tiempo real: ${data.state}`);
                    setSelectedOrder((prev: any) => ({ ...prev, state: data.state }));
                });

                return () => {
                    socket.off(channel); // Limpieza al desmontar
                };

            } catch (error) {
                console.error("Error al obtener los detalles adicionales:", error);
            }
        };

        fetchAdditionalDetails();
    }, [selectedOrder]);

    if (!selectedOrder || !card || !address || items.length === 0) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <h2 className="text-2xl font-bold text-[#820000] mb-6">Detalles de la Orden</h2>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#820000]">
                        Id Pedido: {selectedOrder._id.slice(-8)}
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

            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Dirección de Envío</h3>
                <p className="text-sm text-gray-600">
                    {address.name} — {`${address.street} ${address.number}, ${address.zip_code}, ${address.city}, ${address.state}`}
                </p>
            </div>

            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Forma de Pago</h3>
                <div className="flex items-center gap-4">
                    <img src={getCardLogo(card.type)} alt={card.type} className="w-10 h-6" />
                    <span className="text-sm font-medium">
                        Terminada en {card.last4} ({card.type})
                    </span>
                </div>
            </div>

            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#820000]">Productos</h3>
                <ul className="space-y-4 mt-4">
                    {items.map((item) => (
                        <li key={item._id} className="flex items-center justify-between gap-4 border-b pb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.book.image}
                                    alt={item.book.title}
                                    className="w-12 h-16 object-cover rounded cursor-pointer"
                                />
                                <div onClick={() => navigate(`/book/${item.book.ISBN}`)}>
                                    <p className="font-medium text-sm cursor-pointer">{item.book.title}</p>
                                    <p className="text-xs text-gray-500">{item.book.author}</p>
                                    <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm font-medium">
                                <p>${item.book.price ? item.book.price.toFixed(2) : "N/A"}</p>
                                <p className="text-[#007B83]">
                                    {item.book.price && item.quantity
                                        ? (item.book.price * item.quantity).toFixed(2)
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
