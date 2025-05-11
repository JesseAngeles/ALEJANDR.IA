import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { OrderSummaryProps } from "@/assets/types/summary";
import { useNavigate } from "react-router-dom";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { usePurchase } from "@/app/domain/context/PurchaseContext";
import { orderService } from "@/app/domain/service/orderService";

type Props = {
  summary: OrderSummaryProps;
};

const OrderSummary: React.FC<Props> = ({ summary }) => {
  const { cart, address, paymentMethod, totalItems, total } = summary;
  const { resetPurchase } = usePurchase();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      await orderService.sendOrder(summary);
      resetPurchase();
      navigate("/confirmation");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al procesar tu compra.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Title */}
      <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
        Resumen del pedido
      </h2>

      {/* Order Info */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold">Total de productos:</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-semibold">Dirección de envío:</span>
          <span className="text-sm">
            {address.name} — {`${address.street} ${address.number}, ${address.zip_code}, ${address.city}, ${address.state}`}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-1 items-start md:items-center">
          <span className="font-semibold">Forma de pago:</span>
          <div className="flex items-center gap-2">
            <img
              src={getCardLogo(paymentMethod.type)}
              alt={paymentMethod.type}
              className="w-8 h-auto"
            />
            <span className="text-sm font-medium">
              Terminada en {paymentMethod.last4} {paymentMethod.type}
            </span>
          </div>
        </div>

        {/* Product list */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-base mb-2">Productos:</h3>
          <ul className="space-y-4">
            {cart.map((book) => (
              <li
                key={book.ISBN}
                className="flex items-center justify-between gap-4 border-b pb-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={book.imagen}
                    alt={book.titulo}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{book.titulo}</p>
                    <p className="text-xs text-gray-500">{book.autor}</p>
                    <p className="text-xs text-gray-600">
                      Cantidad: {book.cantidad}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm font-medium">
                  <p>${book.precio.toFixed(2)}</p>
                  <p className="text-[#007B83]">
                    ${(book.precio * book.cantidad).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="border-t pt-2 flex justify-between mt-4">
          <span className="font-semibold text-base">Total:</span>
          <span className="text-[#007B83] font-semibold text-base">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleConfirm}
          className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
        >
          Confirmar compra
        </button>
      </div>
    </div>
  );
};

export { OrderSummary };
