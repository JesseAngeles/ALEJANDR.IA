import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { Address } from "@/assets/types/address";
import { addressService } from "@/app/domain/service/addressService";


const AddDeliveryAddress: React.FC = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/account/addresses";

  const navigate = useNavigate();

  const cleanZipCode = (zip: string) => {
    let cleaned = zip.replace(/^0+/, "");
    while (cleaned.length < 5) {
      cleaned += "0";
    }
    return cleaned;
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

   if (!number.trim()) {
    newErrors.number = "Este campo es obligatorio.";
  } else if (!/^\d+$/.test(number)) {
    newErrors.number = "Debe ser un número entero válido.";
  } else if (parseInt(number) <= 0) {
    newErrors.number = "Debe ser un número mayor a 0.";
  }

    if (!street.trim()) newErrors.street = "Este campo es obligatorio.";
    if (!state.trim()) newErrors.state = "Este campo es obligatorio.";
    if (!city.trim()) newErrors.city = "Este campo es obligatorio.";

    const cleanedZip = cleanZipCode(zip_code);
    if (!zip_code.trim()) {
      newErrors.zip_code = "Este campo es obligatorio.";
    } else if (!/^\d{5}$/.test(cleanedZip)) {
      newErrors.zip_code = "Debe ser un código postal válido de 5 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    const newAddress = {
      name,
      number,
      street,
      city,
      zip_code: parseInt(cleanZipCode(zip_code)),
      state,
    };

    try {
      await addressService.add(newAddress as Address);
      setSuccess(true);
    } catch (error) {
      console.error("Error al agregar dirección:", error);
      setErrors({ general: "No se pudo guardar la dirección." });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <h2 className="text-lg font-semibold text-[#820000] mb-6">
        Agregar dirección de envío
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Alías de la dirección</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Número:</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border rounded w-full p-2"
          />
          {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Calle:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="border rounded w-full p-2"
          />
          {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Estado:</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border rounded w-full p-2"
            />
            {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1">Municipio:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded w-full p-2"
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Código postal:</label>
          <input
            type="text"
            value={zip_code}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
            maxLength={5}
            className="border rounded w-24 p-2"
          />
          {errors.zip_code && <p className="text-red-600 text-sm mt-1">{errors.zip_code}</p>}
        </div>

        {errors.general && (
          <p className="text-red-600 text-sm text-center mt-2">{errors.general}</p>
        )}

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
          >
            Agregar
          </button>
        </div>
      </form>

      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <p className="text-[#000] font-semibold mb-4">
              Dirección agregada correctamente
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                navigate(returnTo);
              }}
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

export { AddDeliveryAddress };

