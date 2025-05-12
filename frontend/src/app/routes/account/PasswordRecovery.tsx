import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordRecovery: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;

        if (!verificationCode.trim()) newErrors.verificationCode = "Este campo es obligatorio";
        if (!newPassword.trim()) newErrors.newPassword = "Este campo es obligatorio";
        else if (!passwordRegex.test(newPassword))
            newErrors.newPassword =
                "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial";
        if (newPassword !== confirmPassword) newErrors.confirmPassword = "La contraseña no coincide";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateFields();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Aquí iría la lógica para enviar el código y las nuevas contraseñas al backend
            setSuccess(true);
            setErrors({});
        } catch (error) {
            console.error("Error al recuperar la contraseña:", error);
            setErrors({ general: "Hubo un error al procesar la recuperación" });
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            {/* Regresar */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-sm text-black hover:underline"
                >
                    <span className="text-xl">←</span> Regresar
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-[#820000] mb-6">Recuperación de contraseña</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-sm text-gray-700">
                    <p className="mb-3">
                        Se ha enviado un código de verificación a tu correo,{" "}
                        ingrésalo para recuperar tu contraseña.
                    </p>
                </div>

                {/* Código de verificación */}
                <div>
                    <label className="block text-sm mb-1">Código de verificación:</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                    {errors.verificationCode && <p className="text-red-600 text-xs">{errors.verificationCode}</p>}
                </div>

                {/* Nueva contraseña */}
                <div>
                    <label className="block text-sm mb-1">Nueva contraseña:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                    {errors.newPassword && <p className="text-red-600 text-xs">{errors.newPassword}</p>}
                </div>

                {/* Confirmar nueva contraseña */}
                <div>
                    <label className="block text-sm mb-1">Confirmar contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
                </div>

                {/* Error general */}
                {errors.general && (
                    <p className="text-red-600 text-xs mt-2">{errors.general}</p>
                )}

                {/* Botón de cambio */}
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        className="bg-[#007B83] text-white px-6 py-2 rounded hover:bg-[#00666e]"
                    >
                        Cambiar
                    </button>
                </div>
            </form>
        </div>
    );
};

export { PasswordRecovery };
