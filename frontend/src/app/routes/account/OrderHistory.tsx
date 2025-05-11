// src/app/routes/account/OrderHistory.tsx
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import { orderService } from "@/app/domain/service/orderService";
import type { Order } from "@/assets/types/order"; // Asegúrate de tener este tipo definido

const OrderHistory: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await orderService.getUserOrders();
                setOrders(userOrders);
            } catch (err) {
                console.error("Error al cargar pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
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
                    <h2 className="text-2xl font-bold text-[#820000] mb-6">Historial de pedidos</h2>

                    {loading ? (
                        <p className="text-center text-gray-600">Cargando pedidos...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-center text-gray-500">No hay pedidos registrados.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="border rounded bg-gray-50 p-4 text-sm"
                                >
                                    <div className="mb-2 flex justify-between">
                                        <p className="font-semibold text-[#820000]">
                                            Pedido #{order._id.slice(-6)}
                                        </p>
                                        <p className="text-sm text-gray-700 font-medium">
                                            Estado: <span className="text-[#007B83]">{order.state}</span>
                                        </p>
                                    </div>
                                    <p className="text-gray-700 mb-1">
                                        Total: ${order.total.toFixed(2)} — {order.items.length} producto(s)
                                    </p>
                                    <p className="text-xs text-gray-500">Fecha: {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export { OrderHistory };
