import React, { useEffect, useState } from "react";
import { orderService } from "@/app/domain/service/orderService";
import { cartService } from "@/app/domain/service/cartService";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/app/domain/context/OrderContext";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

// const getStatusColor = (state: string) => {
//     switch (state.toLowerCase()) {
//         case 'pendiente':
//             return 'text-yellow-800 bg-yellow-100';
//         case 'en preparación':
//             return 'text-orange-800 bg-orange-100';
//         case 'cancelado':
//             return 'text-red-700 bg-red-100';
//         case 'enviado':
//             return 'text-blue-700 bg-blue-100';
//         case 'en tránsito':
//             return 'text-indigo-700 bg-indigo-100';
//         case 'entregado':
//             return 'text-green-700 bg-green-100';
//         case 'en devolución':
//             return 'text-pink-700 bg-pink-100';
//         case 'devuelto':
//             return 'text-purple-700 bg-purple-100';
//         default:
//             return 'text-gray-700 bg-gray-100';
//     }
// };

const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
        case 'cancelado':
            return 'text-red-700';
        case 'devuelto':
            return 'text-orange-800';
        default:
            return 'text-blue-700';
    }
};

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [orderPreviews, setOrderPreviews] = useState<{ [id: string]: string[] }>({});
    const navigate = useNavigate();
    const { setSelectedOrder } = useOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await orderService.getUserOrders();
                setOrders(userOrders);

                // Cargar portadas por pedido
                const previews: { [id: string]: string[] } = {};
                await Promise.all(userOrders.map(async (order) => {
                    const previewsForOrder: string[] = [];
                    for (let i = 0; i < order.items.length/* Math.min(order.items.length, 3) */; i++) {
                        const item = order.items[i];
                        try {
                            const book = await cartService.getBookById(item.bookId);
                            if (book?.image) previewsForOrder.push(book.image);
                        } catch (e) {
                            console.warn(`No se pudo obtener el libro con ID ${item.bookId}`);
                        }
                    }
                    previews[order._id] = previewsForOrder;
                }));
                setOrderPreviews(previews);

                // Escuchar cambios
                userOrders.forEach((order) => {
                    const channel = `orderStatus:${order._id}`;
                    socket.on(channel, (data: { state: string }) => {
                        setOrders((prev) =>
                            prev.map((o) =>
                                o._id === order._id ? { ...o, state: data.state } : o
                            )
                        );
                    });
                });

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
    }, []);

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        navigate(`/order/${order._id}`);
    };

    const renderOrderSection = (title: string, filteredOrders: any[]) => (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {filteredOrders.length === 0 ? (
                <p className="text-gray-600 text-sm">No hay pedidos en esta categoría.</p>
            ) : (
                filteredOrders.map((order) => (
                    <div
                        key={order._id}
                        className="border p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer mb-3"
                        onClick={() => handleViewDetails(order)}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-indigo-700">
                                Id Pedido: <span /* className="bg-indigo-100 px-2 py-1 rounded" */
                                    className="px-2 py-1 rounded">{order._id.slice(-8)}</span>
                            </h3>
                            <span className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-600">
                                Estado:{' '}
                                <span className={`font-semibold px-2 py-1 rounded ${getStatusColor(order.state)}`}>
                                    {order.state}
                                </span>
                            </p>
                            <p className="text-gray-600">Total: ${order.total}</p>
                            <p className="text-gray-600">Número de productos: {order.noItems}</p>
                        </div>

                        {orderPreviews[order._id]?.length > 0 && (
                            <div className="flex mt-4 space-x-2">
                                {orderPreviews[order._id].map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Libro ${idx + 1}`}
                                        className="w-12 h-16 object-cover rounded shadow"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    const activeOrders = orders.filter((o) => o.state !== "Entregado" && o.state !== "Cancelado" && o.state !== "Devuelto");
    const deliveredOrders = orders.filter((o) => o.state === "Entregado");
    const canceledOrders = orders.filter((o) => o.state === "Cancelado" || o.state === "Devuelto");

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 relative">
            <button
                onClick={() => navigate("/")}
                className="flex items-center text-sm text-black mb-6 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <AccountSidebar />

                <section className="flex-1">
                    <h2 className="text-2xl font-bold text-[#820000] mb-6">Historial de pedidos</h2>

                    {orders.length === 0 ? (
                        <p>No tienes pedidos realizados.</p>
                    ) : (
                        <>
                            {renderOrderSection("Activos", activeOrders)}
                            {renderOrderSection("Entregados", deliveredOrders)}
                            {renderOrderSection("Finalizados", canceledOrders)}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export { OrderHistory };
