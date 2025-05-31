import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails } from "app_admin/services/orderService";
import { useAuth } from "@/app_admin/context/AdminAuthContext";
import { FaArrowLeft } from "react-icons/fa";

// Solo los colores NO comentados
const getStatusColor = (state: string) => {
  switch (state?.toLowerCase()) {
    case "cancelado":
      return "text-red-700";
    case "devuelto":
      return "text-orange-800";
    default:
      return "text-blue-700";
    // Ejemplo de otros colores (solo referencia, siguen comentados)
    // case "pendiente":
    //   return "text-yellow-800 bg-yellow-100";
    // case "en preparación":
    //   return "text-orange-800 bg-orange-100";
    // case "enviado":
    //   return "text-blue-700 bg-blue-100";
    // case "en tránsito":
    //   return "text-indigo-700 bg-indigo-100";
    // case "entregado":
    //   return "text-green-700 bg-green-100";
    // case "en devolución":
    //   return "text-pink-700 bg-pink-100";
    // case "devuelto":
    //   return "text-purple-700 bg-purple-100";
    // default:
    //   return "text-gray-700 bg-gray-100";
  }
};

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !id) return;
      try {
        const fetchedOrder = await getOrderDetails(id, token);
        setOrder(fetchedOrder);
      } catch (error) {
        setError("Error al obtener los detalles del pedido");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [token, id]);

  if (loading) {
    return <div className="text-center py-10">Cargando detalles del pedido...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-10">Pedido no encontrado.</div>;
  }

  // Calcular el total
  const total = order.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.bookId.price,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <h2 className="text-2xl font-bold text-[#820000] mb-8">Detalles del Pedido</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna Izquierda: Datos del pedido y productos */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-6">
                <span className="text-base font-semibold">
                  Pedido <span className="font-mono">{order._id.slice(-8)}</span>
                </span>
                <span className={`font-semibold px-2 ${getStatusColor(order.state)}`}>
                  {order.state}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Fecha: </span>
                {order.date ? new Date(order.date).toLocaleDateString() : ""}
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Cliente: </span>
                {order.client?.name || "No disponible"}
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Productos</h3>
            <ul className="divide-y">
              {order.items.map((item: any) => (
                <li
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-4 py-4 items-center"
                >
                  <img
                    src={item.bookId?.image || "/img/default.jpg"}
                    alt={item.bookId?.title || "Imagen no disponible"}
                    className="w-14 h-20 object-cover rounded shadow"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-base">
                      {item.bookId?.title || "Título no disponible"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.bookId?.author || "Autor no disponible"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm min-w-[120px]">
                    <span>Precio: ${item.bookId?.price.toFixed(2)}</span>
                    <span>Cantidad: {item.quantity}</span>
                    <span className="text-[#007B83] font-medium">
                      Subtotal: ${(item.bookId?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna Derecha: Resumen y dirección */}
        <div className="w-full md:w-96 flex-shrink-0">
          {/* Resumen */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Resumen</h3>
            <div className="flex justify-between mb-2 text-base">
              <span>Total de productos:</span>
              <span>{order.items.length}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal de compra:</span>
              <span className="text-[#007B83]">${total.toFixed(2)}</span>
            </div>
          </div>
          {/* Dirección */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Dirección de envío</h3>
            <div className="text-sm text-gray-700">
              {order.direction?.street} {order.direction?.number}
              <br />
              {order.direction?.city}, {order.direction?.state}
              <br />
              CP {order.direction?.zip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OrderDetails };
