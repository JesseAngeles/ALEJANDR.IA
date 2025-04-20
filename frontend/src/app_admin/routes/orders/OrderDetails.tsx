import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const mockOrder = {
  id: 1033,
  items: [
    {
      id: 1,
      title: "ALAS DE ÓNIX",
      author: "REBECCA YARROS",
      price: 569,
      quantity: 1,
      image: "/img/alas.jpg",
    },
    {
      id: 2,
      title: "FRANCO",
      author: "PAUL PRESTON",
      price: 569,
      quantity: 1,
      image: "/img/franco.jpg",
    },
    {
      id: 3,
      title: "CUCHARA Y MEMORIA",
      author: "BENITO TAIBO",
      price: 569,
      quantity: 1,
      image: "/img/cuchara.jpg",
    },
  ],
};

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const total = mockOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
        <span className="text-red-700 font-medium">Regresar</span>
      </button>

      <h2 className="text-xl font-semibold text-[#820000] text-center mb-6">
        Detalles del pedido
      </h2>

      <p className="text-lg font-medium mb-4">Pedido No.{mockOrder.id}</p>

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
            {mockOrder.items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.author}</p>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td className="text-[#007B83] font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border mt-8 p-4 w-80 ml-auto rounded shadow text-sm">
        <div className="flex justify-between font-medium mb-2">
          <span>Total de productos:</span>
          <span>{mockOrder.items.length}</span>
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
