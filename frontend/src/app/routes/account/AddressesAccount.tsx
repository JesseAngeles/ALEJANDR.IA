import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import { addressService } from "@/app/domain/service/addressService";
import type { Address } from "@/assets/types/address";

const AddressesAccount: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); 
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const data = await addressService.getAll();
    setAddresses(data);
  };

  const handleRemove = (id: string) => {
    setAddressToDelete(id); // Guardar el ID de la dirección a eliminar
    setShowConfirmDelete(true); // Mostrar el modal de confirmación
  };

  const confirmRemove = async () => {
    if (addressToDelete) {
      await addressService.remove(addressToDelete);
      loadAddresses();
      setShowDeleteSuccess(true);
      setShowConfirmDelete(false); // Cerrar el modal de confirmación
    }
  };

  const cancelRemove = () => {
    setShowConfirmDelete(false); // Cerrar el modal sin eliminar
    setAddressToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          <h2 className="text-2xl font-bold text-[#820000] mb-6">
            Mis direcciones de envío
          </h2>

          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="flex justify-between items-center bg-gray-50 border rounded px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{addr.name}</p>
                  <p className="text-sm text-gray-700">{`${addr.street} ${addr.number}, ${addr.zip_code}, ${addr.city}, ${addr.state}`}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/address/edit/${addr._id}`)}
                    className="text-[#007B83] text-sm flex items-center gap-1 hover:underline"
                  >
                    <FaEdit className="text-xs" /> Editar
                  </button>
                  <button
                    onClick={() => handleRemove(addr._id)}
                    className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                  >
                    <FaTrash className="text-xs" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/address/add")}
              className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
            >
              Agregar nueva dirección
            </button>
          </div>
        </section>
      </div>

      {/* Modal de confirmación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-[#000000] mb-4">
              ¿Estás seguro de que quieres eliminar esta dirección?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={cancelRemove}
                className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRemove}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-[#000000] mb-4">
              Dirección eliminada correctamente
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

export { AddressesAccount };
