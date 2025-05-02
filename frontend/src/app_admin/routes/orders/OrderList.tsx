import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    { id: 1033, date: "2025-04-03", customer: "Ana Pérez", total: 1707, status: "Pendiente" },
    { id: 1032, date: "2025-04-03", customer: "Enrique Sánchez", total: 569, status: "Entregado" },
  ]);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#820000] mb-6">Pedidos</h2>
      <input type="text" placeholder="Buscar pedido" className="mb-4 w-full border px-3 py-2 rounded" />
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
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.date}</td>
              <td className="p-2">{order.customer}</td>
              <td className="p-2 text-teal-600 font-semibold">${order.total}</td>
              <td className="p-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Enviado">Enviado</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  className="mr-3 text-[#820000] hover:underline"
                  onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                >
                  Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { OrderList };
