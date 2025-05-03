/* import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import { orderHistoryService, type OrderHistoryItem } from "@/app/domain/service/cartService";

const statusColor = {
    Entregado: "text-green-600",
    Enviado: "text-blue-600",
    Cancelado: "text-red-600",
} as const;

const OrderHistoryAccount: React.FC = () => {
    const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const data = await orderHistoryService.getAll();
        setOrders(data);
    };

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
                    <h2 className="text-2xl font-bold text-[#820000] mb-6">Mi historial de pedidos</h2>

                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center bg-gray-50 border rounded px-4 py-3 text-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={order.imagen}
                                        alt={order.titulo}
                                        className="w-14 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold">{order.titulo}</p>
                                        <p className="text-xs text-gray-500">{order.autor}</p>
                                        <p className="text-sm text-gray-700 mt-1 font-medium">${order.precio.toFixed(2)}</p>
                                        {order.status !== "Cancelado" && (
                                            <p className="text-xs text-[#007B83] mt-1 underline cursor-pointer">
                                                ¿Qué te pareció el libro?
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={`font-semibold ${statusColor[order.status]}`}>
                                    {order.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export { OrderHistoryAccount };
 */