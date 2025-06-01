import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordService } from "@/app/domain/service/passwordService";
import { FaArrowLeft } from "react-icons/fa";

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState(false);
    const [isTokenSent, setIsTokenSent] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const navigate = useNavigate();

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;

        if (!verificationCode.trim()) newErrors.verificationCode = "Este campo es obligatorio";
        if (!newPassword.trim()) newErrors.newPassword = "Este campo es obligatorio";
        else if (!passwordRegex.test(newPassword))
            newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial";
        if (newPassword !== confirmPassword) newErrors.confirmPassword = "La contraseña no coincide";

        return newErrors;
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setErrors({ email: "El correo es obligatorio" });
            return;
        }

        try {
            await passwordService.getToken({ email: email });
            setIsTokenSent(true);
        } catch (error) {
            setErrors({ general: "Hubo un error al enviar el código de verificación" });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateFields();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await passwordService.update({
                email: email,
                token: verificationCode,
                newPassword: newPassword,
            });

            setSuccess(true);
            setErrors({});
        } catch (error) {
            setErrors({ general: "Hubo un error al procesar la recuperación" });
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm text-black hover:underline mb-4"
                >
                    <FaArrowLeft className="mr-2 text-black" />
                    Regresar
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-[#820000] mb-6">Recuperación de contraseña</h2>

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
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
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

                    <div className="relative">
                        <label className="block text-sm mb-1">Nueva contraseña:</label>
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="absolute right-3 top-9 text-blue-700 text-sm hover:underline"
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
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                            className="absolute right-3 top-9 text-blue-700 text-sm hover:underline"
                        >
                            {mostrarConfirmacion ? "Ocultar" : "Mostrar"}
                        </button>
                        {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
                    </div>

                    {errors.general && (
                        <p className="text-red-600 text-xs mt-2">{errors.general}</p>
                    )}

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

            {success && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-[#000000] mb-4">
                            ¡Contraseña actualizada correctamente!
                        </h3>
                        <button
                            onClick={() => navigate("/login")}
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
