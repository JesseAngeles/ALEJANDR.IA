import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails } from "app_admin/services/orderService"; 
import { useAuth } from "@/app_admin/context/AdminAuthContext"; 
import { FaArrowLeft } from "react-icons/fa";

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
        // Obtener los detalles del pedido
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
  const total = order.items.reduce((acc: number, item: any) => acc + item.quantity * item.bookId.price, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
                Regresar
      </button>

      <h2 className="text-xl font-semibold text-[#820000] text-center mb-6">
        Detalles del pedido
      </h2>

      <p className="text-lg font-medium mb-4">Pedido No.{order._id}</p>
      <p className="text-sm font-medium mb-4">Cliente: {order.client?.name || "No disponible"}</p>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-separate border-spacing-y-4">
          <thead className="text-left">
            <tr className="text-sm font-semibold">
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any) => (
              <tr key={item._id} className="align-top">
                <td className="flex items-center gap-4">
                  <img
                    src={item.bookId?.image || "/img/default.jpg"}
                    alt={item.bookId?.title || "Imagen no disponible"}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.bookId?.title || "Título no disponible"}</p>
                    <p className="text-xs text-gray-600">{item.bookId?.author || "Autor no disponible"}</p>
                  </div>
                </td>
                <td>${item.bookId?.price.toFixed(2)}</td> 
                <td>{item.quantity}</td>
                <td className="text-[#007B83] font-medium">${(item.bookId?.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border mt-8 p-4 w-80 ml-auto rounded shadow text-sm">
        <div className="flex justify-between font-medium mb-2">
          <span>Total de productos:</span>
          <span>{order.items.length}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Subtotal de compra:</span>
          <span className="text-[#007B83] font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export { OrderDetails };
