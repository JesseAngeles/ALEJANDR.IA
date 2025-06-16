import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { useOrder } from "@/app/domain/context/OrderContext";
import { paymentService } from "@/app/domain/service/paymentService";
import { addressService } from "@/app/domain/service/addressService";
import { cartService } from "@/app/domain/service/cartService";
import { bookService } from "@/app/domain/service/bookService";
import { orderService } from "@/app/domain/service/orderService";
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


const Modal = ({ message, onClose, onConfirm }: { message: string; onClose: () => void, onConfirm: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-[#007B83] mb-4">Confirmar Acción</h3>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex justify-around">
                <button
                    onClick={onClose}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#005f6b]"
                >
                    Confirmar
                </button>
            </div>
        </div>
    </div>
);

const OrderDetails: React.FC = () => {
    const { selectedOrder: contextSelectedOrder } = useOrder();
    const [selectedOrder, setSelectedOrder] = useState(contextSelectedOrder);
    const [card, setCard] = useState<any | null>(null);
    const [address, setAddress] = useState<any | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [reviewStatus, setReviewStatus] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmación
    const [actionToConfirm, setActionToConfirm] = useState<"cancel" | "return" | null>(null); 
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    // SOCKET EFFECT
    useEffect(() => {
        if (!selectedOrder) return;

        const channel = `orderStatus:${selectedOrder._id}`;
        const handleStateChange = (data: { state: string }) => {
            setSelectedOrder((prev: any) => (prev ? { ...prev, state: data.state } : prev));
        };

        socket.on(channel, handleStateChange);
        return () => {
            socket.off(channel, handleStateChange);
        };
    }, [selectedOrder?._id]);

    // FETCH DETAILS
    const fetchAdditionalDetails = async (order: typeof selectedOrder) => {
        if (!order) return;
        setIsLoading(true);
        try {
            const [cardDetails, addressDetails] = await Promise.all([
                paymentService.getById(order.card),
                addressService.getById(order.direction),
            ]);
            setCard(cardDetails);
            setAddress(addressDetails);

            const bookDetails = await Promise.all(
                order.items.map(async (item: any) => {
                    const book = await cartService.getBookById(item.bookId);
                    return { ...item, book };
                })
            );
            setItems(bookDetails);

            if (order.state === "Entregado") {
                const reviewChecks = await Promise.all(
                    bookDetails.map(async (item) => {
                        try {
                            const hasReview = await bookService.verificarReviewUsuario(item.book.ISBN);
                            return { isbn: item.book.ISBN, hasReview: hasReview.hasReview };
                        } catch {
                            return { isbn: item.book.ISBN, hasReview: true };
                        }
                    })
                );
                const reviewMap = reviewChecks.reduce((acc, curr) => {
                    acc[curr.isbn] = curr.hasReview;
                    return acc;
                }, {} as { [key: string]: boolean });

                setReviewStatus(reviewMap);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setSelectedOrder(contextSelectedOrder);
    }, [contextSelectedOrder]);

    useEffect(() => {
        if (selectedOrder) {
            fetchAdditionalDetails(selectedOrder);
        }
    }, [selectedOrder]);

    const handleWriteReview = (isbn: string) => {
        navigate(`/review/${isbn}`);
    };

    const showModal = (message: string) => {
        setModalMessage(message);
        setTimeout(() => setModalMessage(null), 3000); // auto-close after 3s
    };

    

    // CONFIRMAR ACCIÓN: CANCELAR O DEVOLVER
    const handleActionConfirm = async () => {
        if (actionToConfirm === "cancel") {
            await handleCancelOrder();
        } else if (actionToConfirm === "return") {
            await handleReturnOrder();
        }
        setShowConfirmModal(false); // Cerrar el modal de confirmación
    };

    const handleCancelOrder = async () => {
        try {
            await orderService.cancelOrder(selectedOrder._id);
            setSelectedOrder((prev: any) => (prev ? { ...prev, state: "Cancelado" } : prev));
            setModalMessage("Tu pedido ha sido cancelado con éxito.");
        } catch {
            setModalMessage("No se pudo cancelar el pedido.");
        }
    };

    const handleReturnOrder = async () => {
        try {
            await orderService.returnOrder(selectedOrder._id);
            setSelectedOrder((prev: any) => (prev ? { ...prev, state: "En Devolución" } : prev));
            setModalMessage("Tu pedido ha sido marcado para devolución.");
        } catch {
            setModalMessage("No se pudo devolver el pedido.");
        }
    };

    const showConfirmationModal = (action: "cancel" | "return") => {
        setActionToConfirm(action);
        const message = action === "cancel"
            ? "¿Estás seguro de que quieres cancelar este pedido?"
            : "¿Estás seguro de que quieres devolver este pedido?";
        setModalMessage(message);
        setShowConfirmModal(true);
    };
    

    if (isLoading) return <div>Cargando...</div>;
    if (!selectedOrder || !card || !address) return <div>Error al cargar los detalles de la pedido.</div>;

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm text-black mb-6 hover:underline"
                >
                    <FaArrowLeft className="mr-2" />
                    Regresar
                </button>

                <h2 className="text-2xl font-bold text-[#820000] mb-6">Detalles del Pedido</h2>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-indigo-700">
                            Id Pedido: {selectedOrder._id.slice(-8)}
                        </h3>
                        <span className="text-sm text-gray-500">
                            {new Date(selectedOrder.date).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="mt-2">
                        <p className="text-gray-600">
                            Estado:
                            <span className={`font-semibold px-2 py-1 rounded ${getStatusColor(selectedOrder.state)}`}>
                                {selectedOrder.state}
                            </span>
                        </p>
                        <p className="text-gray-600">Total: ${selectedOrder.total.toFixed(2)}</p>
                        <p className="text-gray-600">Número de productos: {selectedOrder.noItems}</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                <button
                        onClick={() => showConfirmationModal("cancel")}
                        disabled={selectedOrder.state !== "En Preparación"}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${selectedOrder.state !== "En Preparación"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        Cancelar Pedido
                    </button>

                    <button
                        onClick={() => showConfirmationModal("return")}
                        disabled={selectedOrder.state !== "Entregado"}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${selectedOrder.state !== "Entregado"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                    >
                        Devolver Pedido
                    </button>
                </div>

                {/* Dirección */}
                <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-700">Dirección de Envío</h3>
                    <p className="text-sm text-gray-600">
                        {address.name} — {`${address.street} ${address.number}, ${address.zip_code}, ${address.city}, ${address.state}`}
                    </p>
                </div>

                {/* Pago */}
                <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-700">Forma de Pago</h3>
                    <div className="flex items-center gap-4">
                        <img src={getCardLogo(card.type)} alt={card.type} className="w-10 h-6" />
                        <span className="text-sm font-medium">
                            Terminada en {card.last4} ({card.type})
                        </span>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-700">Productos</h3>

                    {items.length === 0 ? (
                        <p className="text-sm text-gray-600 mt-4">Este pedido no contiene productos.</p>
                    ) : (
                        <ul className="space-y-4 mt-4">
                            {items.map((item: any) => (
                                <li
                                    key={item._id}
                                    className="flex items-center justify-between gap-4 border-b pb-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.book.image}
                                            alt={item.book.title}
                                            className="w-12 h-16 object-cover rounded cursor-pointer"
                                            onClick={() => navigate(`/book/${item.book.ISBN}`)}
                                        />
                                        <div onClick={() => navigate(`/book/${item.book.ISBN}`)}>
                                            <p className="font-medium text-sm cursor-pointer">{item.book.title}</p>
                                            <p className="text-xs text-gray-500">{item.book.author}</p>
                                            <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right text-sm font-medium">
                                            <p>${item.book.price?.toFixed(2) ?? "N/A"}</p>
                                            <p className="text-[#007B83]">
                                                {item.book.price && item.quantity
                                                    ? (item.book.price * item.quantity).toFixed(2)
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        {selectedOrder.state === "Entregado" &&
                                            reviewStatus[item.book.ISBN] === false && (
                                                <button
                                                    onClick={() => handleWriteReview(item.book.ISBN)}
                                                    className="bg-cyan-700 text-white px-3 py-1 rounded text-xs hover:bg-[#660000] transition-colors"
                                                >
                                                    Escribir reseña
                                                </button>
                                            )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación */}
            {showConfirmModal && (
                    <Modal message={modalMessage!} onClose={() => setShowConfirmModal(false)} onConfirm={handleActionConfirm} />
                )}
        </>
    );
};

export { OrderDetails };
