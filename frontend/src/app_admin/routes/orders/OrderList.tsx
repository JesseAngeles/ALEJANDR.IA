import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus } from "app_admin/services/orderService";
import { useAuth } from "@/app_admin/context/AdminAuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const getStatusColor = (state: string) => {
  switch (state?.toLowerCase()) {
    default:
      return "";
  }
};

const STATE_FLOW = [
  "Pendiente",
  "En Preparación",
  "Enviado",
  "En Tránsito",
  "Entregado",
  "En Devolución",
  "Devuelto",
];

const getNextState = (state: any) => {
  const idx = STATE_FLOW.indexOf(state);
  return idx !== -1 && idx < STATE_FLOW.length - 1 ? STATE_FLOW[idx + 1] : null;
};

const categorizeOrders = (orders: any[]) => {
  console.log(orders)
  return {
    activos: orders.filter(o => ["Pendiente", "En Preparación"].includes(o.state)),
    transporte: orders.filter(o => ["Enviado", "En Tránsito", "En Devolución"].includes(o.state)),
    finalizados: orders.filter(o => ["Entregado", "Devuelto", "Cancelado"].includes(o.state)),
  };
};

const StatusStepper = ({ currentState, onNext }: any) => {
  // Si el estado es Cancelado, Devuelto o Entregado, solo muestra el texto centrado con color.
  if (
    currentState === "En Preparación"
  ) {
    const nextState = getNextState(currentState);
    return (
      <div className="flex justify-center items-center h-full space-x-2">
        <span className={`font-medium ${getStatusColor(currentState)}`}>
          {currentState}
        </span>
        {nextState && (
          <>
            <span className="text-gray-400">→</span>
            <button
              className={`
                px-3 py-1 rounded
                transition
                "text-[#820000] hover:underline"
              `}
              onClick={onNext}
              title={
                `Avanzar a ${nextState}`
              }
            >
              <span className="text-[#820000] hover:underline">Enviar</span>
            </button>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-full">
        <span className={`font-medium ${getStatusColor(currentState)}`}>
          {currentState}
        </span>
      </div>
    );
  }
};

const OrderList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch y sockets
  useEffect(() => {
    if (!token) return;
    const fetchOrders = async () => {
      try {
        const fetched = await getOrders(token);
        setOrders(fetched);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();

    // Suscripción sockets
    return () => {
      orders.forEach(order => socket.off(`orderStatus:${order._id}`));
    };
  }, [token]);

  // Suscripción individual por pedido
  useEffect(() => {
    if (!token) return;
    orders.forEach((order: any) => {
      socket.on(`orderStatus:${order._id}`, (data: any) => {
        setOrders(prev => prev.map(o => o._id === order._id ? { ...o, state: data.state } : o));
      });
    });
    return () => {
      orders.forEach((order) => {
        socket.off(`orderStatus:${order._id}`);
      });
    };
  }, [orders, token]);

  const handleStatusChange = async (orderId: any, currentState: any) => {
    const nextState = getNextState(currentState);
    if (!nextState || !token) return;
    try {
      await updateOrderStatus(orderId, nextState, token);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const handleModalClose = async () => {
    setShowSuccessModal(false);
    if (token) {
      const fetched = await getOrders(token);
      setOrders(fetched);
    }
  };

  const { activos, transporte, finalizados } = categorizeOrders(orders);

  const renderOrdersSection = (title: any, orderList: any[]) => (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      {orderList.length === 0 ? (
        <div className="text-gray-500 text-center">No hay pedidos.</div>
      ) : (
        <table className="w-full border mb-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center">Pedido</th>
              <th className="p-2 text-center">Cliente</th>
              <th className="p-2 text-center">Fecha</th>
              <th className="p-2 text-center">Total</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-2 text-center">{order._id.slice(-8)}</td>
                <td className="p-2 text-center">{order.client?.name || "Desconocido"}</td>
                <td className="p-2 text-center">{order.date?.slice(0, 10)}</td>
                <td className="p-2 text-center">${order.total}</td>
                <td className="p-2 text-center">
                  <StatusStepper
                    currentState={order.state}
                    onNext={() => handleStatusChange(order._id, order.state)}
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    className="mr-3 text-[#820000] hover:underline"
                    onClick={() => navigate(`/admin/pedidos/${order._id}`)}
                  >
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Pedidos</h2>
      {renderOrdersSection("Activos", activos)}
      {renderOrdersSection("En transporte", transporte)}
      {renderOrdersSection("Finalizados", finalizados)}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#000000] mb-4">
              ¡Estado actualizado correctamente!
            </h3>
            <button
              onClick={handleModalClose}
              className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { OrderList };
