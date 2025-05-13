import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/app/domain/service/userService"; // Asegúrate de importar el servicio

const PasswordReset: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal
    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;

        if (!oldPassword.trim()) newErrors.oldPassword = "Este campo es obligatorio";
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
            // Llamada al servicio para actualizar la contraseña
            const response = await userService.updatePassword({
                password: oldPassword,
                newPassword: newPassword,
            });

            if (response) {
                setErrors({}); // Limpiar errores
                setShowSuccessModal(true); // Mostrar modal de éxito
                setTimeout(() => navigate("/"), 2000); // Redirigir después de 2 segundos
            }
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
                {/* Contraseña actual */}
                <div>
                    <label className="block text-sm mb-1">Contraseña actual:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                    {errors.oldPassword && <p className="text-red-600 text-xs">{errors.oldPassword}</p>}
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

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-[#000000] mb-4">
                            ¡Datos actualizados correctamente!
                        </h3>
                        <button
                            onClick={() => setShowSuccessModal(false)}
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

export { PasswordReset };
