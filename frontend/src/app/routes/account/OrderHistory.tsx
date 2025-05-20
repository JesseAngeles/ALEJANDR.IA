import React, { useEffect, useState } from "react";
import { orderService } from "@/app/domain/service/orderService";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/domain/context/OrderContext";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();
    const { setSelectedOrder } = useOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await orderService.getUserOrders();
                setOrders(userOrders);

                // Suscribirse a cambios por WebSocket
                userOrders.forEach((order) => {
                    const channel = `orderStatus:${order._id}`;
                    socket.on(channel, (data: { state: string }) => {
                        console.log(`📦 Actualización de estado para ${order._id}: ${data.state}`);
                        setOrders((prev) =>
                            prev.map((o) =>
                                o._id === order._id ? { ...o, state: data.state } : o
                            )
                        );
                    });
                });

                // Cleanup al desmontar
                return () => {
                    userOrders.forEach((order) => {
                        socket.off(`orderStatus:${order._id}`);
                    });
                };

            } catch (error) {
                console.error("Error al obtener las órdenes", error);
            }
        };

        fetchOrders();
        console.log(`Escuchando por websocket cambios en los pedidos`)
    }, []);

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        navigate(`/order/${order._id}`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 relative">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <AccountSidebar />

                <section className="flex-1">
                    <h2 className="text-2xl font-bold text-[#820000] mb-6">
                        Historial de pedidos
                    </h2>

                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <p>No tienes pedidos realizados.</p>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="border p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                                    onClick={() => handleViewDetails(order)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">
                                            Id Pedido: {order._id.slice(-8)}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-gray-600">
                                            Estado: <span className="font-semibold">{order.state}</span>
                                        </p>
                                        <p className="text-gray-600">Total: ${order.total}</p>
                                        <p className="text-gray-600">
                                            Número de productos: {order.noItems}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export { OrderHistory };
