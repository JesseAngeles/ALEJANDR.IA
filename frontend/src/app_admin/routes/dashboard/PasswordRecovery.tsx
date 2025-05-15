import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restoreService } from "@/app_admin/services/restoreService";
import { FaArrowLeft } from "react-icons/fa";

const AdminPasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [step, setStep] = useState<"email" | "token">("email");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Este campo es obligatorio" });
      return;
    }

    try {
      await restoreService.generateToken({ email });
      setStep("token");
      setErrors({});
    } catch (error) {
      setErrors({ general: "Error al enviar el código de recuperación." });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!token.trim()) newErrors.token = "Este campo es obligatorio";
    if (!newPassword.trim()) newErrors.newPassword = "Este campo es obligatorio";
    else if (!passwordRegex.test(newPassword))
      newErrors.newPassword = "Debe tener mínimo 8 caracteres, una mayúscula y un símbolo especial";

    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await restoreService.restorePasswordWithToken({ email, token, newPassword });
      setSuccess(true);
      setErrors({});
    } catch (error) {
      setErrors({ general: "Error al actualizar la contraseña" });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 relative">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-black hover:underline mb-4"
        >
          <FaArrowLeft className="mr-2 text-black" />
          Regresar
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-[#820000] mb-6">Recuperación de contraseña (Admin)</h2>

      {!success && step === "email" && (
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </div>

          {errors.general && <p className="text-red-600 text-xs">{errors.general}</p>}

          <button
            type="submit"
            className="w-full bg-[#007B83] text-white py-2 rounded hover:bg-[#00666e]"
          >
            Enviar código
          </button>
        </form>
      )}

      {!success && step === "token" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Código de verificación:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.token && <p className="text-red-600 text-xs">{errors.token}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Nueva contraseña:</label>
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-2 top-9 text-blue-700 text-sm hover:underline"
            >
              {mostrarContrasena ? "Ocultar" : "Mostrar"}
            </button>
            {errors.newPassword && <p className="text-red-600 text-xs">{errors.newPassword}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Confirmar contraseña:</label>
            <input
              type={mostrarConfirmacion ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
              className="absolute right-2 top-9 text-blue-700 text-sm hover:underline"
            >
              {mostrarConfirmacion ? "Ocultar" : "Mostrar"}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && <p className="text-red-600 text-xs">{errors.general}</p>}

          <button
            type="submit"
            className="w-full bg-[#007B83] text-white py-2 rounded hover:bg-[#00666e]"
          >
            Cambiar contraseña
          </button>
        </form>
      )}

      {success && (
        <div className="text-center">
          <p className="text-green-600 font-semibold mb-4">
            ✅ Contraseña actualizada correctamente
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-[#007B83] text-white px-4 py-2 rounded hover:bg-[#00666e]"
          >
            Ir al login
          </button>
        </div>
      )}
    </div>
  );
};

export { AdminPasswordRecovery };

