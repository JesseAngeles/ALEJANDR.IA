import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus } from "app_admin/services/orderService";
import { useAuth } from "@/app_admin/context/AdminAuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

interface OrderUpdatePayload {
  state: string;
}

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Función para obtener las órdenes desde el backend
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const fetchedOrders = await getOrders(token);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Inicializar datos + subscripción a sockets
  useEffect(() => {
    if (!token) return;

    fetchOrders().then(() => {
      // Escuchar cambios en el estado de cada orden
      orders.forEach((order) => {
        const channel = `orderStatus:${order._id}`;
        socket.on(channel, (data: OrderUpdatePayload) => {
          console.log(`📦 Cambio en orden ${order._id}:`, data.state);
          setOrders((prev) =>
            prev.map((o) =>
              o._id === order._id ? { ...o, state: data.state } : o
            )
          );
        });
      });

      return () => {
        // Cleanup listeners
        orders.forEach((order) => {
          socket.off(`orderStatus:${order._id}`);
        });
      };
    });
  }, [token, orders.length]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error actualizando el estado del pedido:", error);
    }
  };

  const handleModalClose = async () => {
    setShowSuccessModal(false);
    await fetchOrders(); // Refrescar el listado
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Pedidos</h2>
      <input
        type="text"
        placeholder="Buscar pedido"
        className="mb-4 w-full border px-3 py-2 rounded"
      />
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Pedido</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Total</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              <td className="p-2">{order._id.slice(-8)}</td>
              <td className="p-2">{order.date?.slice(0, 10)}</td>
              <td className="p-2">{order.client?.name || "Desconocido"}</td>
              <td className="p-2 text-teal-600 font-semibold">${order.total}</td>
              <td className="p-2">
                <select
                  value={order.state}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Enviado" || value === "En Preparación") {
                      handleStatusChange(order._id, value);
                    }
                  }}
                  className="border px-2 py-1 rounded"
>               
                  <option disabled value="Pendiente">Pendiente</option>
                  <option value="Enviado">Enviado</option>
                  <option value="En Preparación">En Preparación</option>
                  <option disabled value="En Tránsito">En Tránsito</option>
                  <option disabled value="Entregado">Entregado</option>
                  <option disabled value="En Devolución">En Devolución</option>
                  <option disabled value="Devuelto">Devuelto</option>
                  <option disabled value="Cancelado">Cancelado</option>
                  </select>

              </td>
              <td className="p-2">
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
