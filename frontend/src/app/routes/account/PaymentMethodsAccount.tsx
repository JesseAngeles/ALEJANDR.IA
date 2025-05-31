import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import { getCardLogo } from "@/app/utils/getCardLogo";
import { paymentService } from "@/app/domain/service/paymentService";
import type { PaymentMethod } from "@/assets/types/card";

const PaymentMethodsAccount: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    let data = await paymentService.getAll();
    setMethods(data);
  };

  const handleRemove = async (id: string) => {
    await paymentService.remove(id);
    loadMethods();
    setShowDeleteSuccess(true);
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
          <h2 className="text-2xl font-bold text-[#820000] mb-6">
            Mis métodos de pago
          </h2>

          <div className="space-y-4">
            {methods.map((card) => (
              <div
                key={card._id}
                className="flex justify-between items-center bg-gray-50 border rounded px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getCardLogo(card.type)}
                    alt={card.type}
                    className="w-10 h-6"
                  />
                  <div>
                    <p>
                      Terminada en{" "}
                      <span className="font-semibold">{card.last4}</span>
                    </p>
                    <p className="text-xs text-gray-600">{card.type}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(card._id.toString())}
                  className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <FaTrash className="text-xs" /> Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/payment/add")}
              className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
            >
              Agregar método de pago
            </button>
          </div>
        </section>
      </div>

      {/* Modal de confirmación */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-[#000000] mb-4">
              Método de pago eliminado correctamente
            </p>
            <button
              onClick={() => setShowDeleteSuccess(false)}
              className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { PaymentMethodsAccount };
