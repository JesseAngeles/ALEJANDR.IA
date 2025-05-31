import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { paymentService } from "@/app/domain/service/paymentService";

const AddPaymentMethod: React.FC = () => {
  const [titular, setTitular] = useState("");
  const [number, setNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const luhnCheck = (num: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const cleanMonth = (month: string) => String(parseInt(month || "0"));
  const cleanCVV = (cvv: string) => {
    let cleaned = cvv.replace(/^0+/, "");
    while (cleaned.length < 3) {
      cleaned += "0"; 
    }
    return cleaned;
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (!titular.trim()) {
      newErrors.titular = "Este campo es obligatorio";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(titular)) {
      newErrors.titular = "Formato inválido. Utilice letras para el nombre.";
    }

    if (!number.trim()) {
      newErrors.number = "Este campo es obligatorio";
    } else if (!/^\d{13,19}$/.test(number)) {
      newErrors.number = "Debe tener entre 13 y 19 dígitos";
    } else if (!luhnCheck(number)) {
      newErrors.number = "Número de tarjeta inválido";
    }

    const month = parseInt(cleanMonth(expirationMonth));
    if (!expirationMonth.trim()) {
      newErrors.expirationMonth = "Este campo es obligatorio";
    } else if (isNaN(month) || month < 1 || month > 12) {
      newErrors.expirationMonth = "Mes inválido";
    }

    const year = parseInt(expirationYear);
    if (!expirationYear.trim()) {
      newErrors.expirationYear = "Este campo es obligatorio";
    } else if (isNaN(year) || year < currentYear) {
      newErrors.expirationYear = "La tarjeta está expirada";
    } else if (year > currentYear + 10) {
      newErrors.expirationYear = `El año no puede ser mayor a ${currentYear + 10}`;
    } else if (year === currentYear && month < currentMonth) {
      newErrors.expirationMonth = "La tarjeta está expirada";
    }

    const cleanedCVV = cleanCVV(securityCode);
    if (!securityCode.trim()) {
      newErrors.securityCode = "Este campo es obligatorio";
    } else if (!/^\d{3}$/.test(cleanedCVV)) {
      newErrors.securityCode = "CVV inválido. Debe tener 3 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateFields()) return;

    const newMethod = {
      titular,
      number,
      expirationMonth: parseInt(cleanMonth(expirationMonth)),
      expirationYear: parseInt(expirationYear),
      securityCode: cleanCVV(securityCode),
    };

    try {
      await paymentService.add(newMethod as any);
      setSuccessMessage(true);
    } catch (error) {
      console.error("Error al guardar método de pago:", error);
      setFormError("Error al guardar método de pago");
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
        Agregar método de pago
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre del titular:</label>
          <input
            type="text"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            className="border rounded w-full p-2"
          />
          {errors.titular && (
            <p className="text-red-600 text-sm mt-1">{errors.titular}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Número de tarjeta:</label>
          <input
            type="text"
            maxLength={19}
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            className="border rounded w-full p-2"
          />
          {errors.number && (
            <p className="text-red-600 text-sm mt-1">{errors.number}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1">Mes:</label>
            <input
              type="text"
              placeholder="mm"
              maxLength={2}
              value={expirationMonth}
              onChange={(e) =>
                setExpirationMonth(e.target.value.replace(/\D/g, ""))
              }
              className="border rounded p-2 w-20 placeholder-gray-500"
            />
            {errors.expirationMonth && (
              <p className="text-red-600 text-sm">
                {errors.expirationMonth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Año:</label>
            <input
              type="text"
              placeholder="aaaa"
              maxLength={4}
              value={expirationYear}
              onChange={(e) =>
                setExpirationYear(e.target.value.replace(/\D/g, ""))
              }
              className="border rounded p-2 w-24 placeholder-gray-500"
            />
            {errors.expirationYear && (
              <p className="text-red-600 text-sm">{errors.expirationYear}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Código de seguridad (CVV):
          </label>
          <input
            type="text"
            placeholder="123"
            maxLength={3}
            value={securityCode}
            onChange={(e) =>
              setSecurityCode(e.target.value.replace(/\D/g, ""))
            }
            className="border rounded p-2 w-24 placeholder-gray-500"
          />
          {errors.securityCode && (
            <p className="text-red-600 text-sm">{errors.securityCode}</p>
          )}
        </div>

        {formError && (
          <p className="text-red-600 text-sm text-center">{formError}</p>
        )}

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-[#007B83] text-white px-6 py-2 rounded hover:bg-[#00666e]"
          >
            Agregar
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <p className="text-[#00000] font-semibold mb-4">
              Método de pago agregado correctamente
            </p>
            <button
              onClick={() => {
                setSuccessMessage(false);
                navigate("/account/payment");
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

export { AddPaymentMethod };
