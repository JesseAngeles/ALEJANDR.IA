import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordService } from "@/app/domain/service/passwordService"; // Asegúrate de importar el servicio

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState("");  // Correo electrónico
    const [verificationCode, setVerificationCode] = useState(""); // Código de verificación
    const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmar nueva contraseña
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const [isTokenSent, setIsTokenSent] = useState(false); // Estado para saber si el token fue enviado
    const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false); // Estado para mostrar el formulario de contraseña
    const navigate = useNavigate();

    // Validación de campos
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

    // Manejo de la solicitud para enviar el correo
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setErrors({ email: "El correo es obligatorio" });
            return;
        }

        try {
            await passwordService.getToken({ email: email });
            setIsTokenSent(true);  // Mostrar los campos de token y nueva contraseña
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            setErrors({ general: "Hubo un error al enviar el código de verificación" });
        }
    };

    // Manejo de la solicitud para restaurar la contraseña
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateFields();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Enviar solicitud PUT para restaurar la contraseña
            await passwordService.update({
                email: email,
                token: verificationCode,
                newPassword: newPassword,
            });

            setSuccess(true);  // Mostrar éxito
            setErrors({});  // Limpiar errores
            setTimeout(() => navigate("/"), 2000); // Redirigir después de 2 segundos
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

            {/* Formulario para el correo */}
            {!isTokenSent ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Correo electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                    </div>

                    {/* Error general */}
                    {errors.general && (
                        <p className="text-red-600 text-xs mt-2">{errors.general}</p>
                    )}

                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="bg-[#007B83] text-white px-6 py-2 rounded hover:bg-[#00666e]"
                        >
                            Enviar código
                        </button>
                    </div>
                </form>
            ) : (
                // Formulario para ingresar el token y la nueva contraseña
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                            Cambiar contraseña
                        </button>
                    </div>
                </form>
            )}

            {/* Modal de éxito */}
            {success && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-[#000000] mb-4">
                            ¡Contraseña actualizada correctamente!
                        </h3>
                        <button
                            onClick={() => setSuccess(false)}
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

export { PasswordRecovery };
