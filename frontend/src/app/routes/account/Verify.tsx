// src/app/components/VerifyAccount.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userService } from "@/app/domain/service/userService";
import { FaArrowLeft } from "react-icons/fa";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const initialEmail = params.get("email") || "";
    const initialToken = params.get("token") || "";

    const [email, setEmail] = useState(initialEmail);
    const [token, setToken] = useState(initialToken);
    // Siempre empezar en askEmail si no hay token; sólo auto-verificar si ya viene token en URL
    const [step, setStep] = useState<"askEmail" | "askToken" | "verifying">(
        initialToken ? "verifying" : "askEmail"
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (step === "verifying") {
            // Si en la URL venía token, lanzar verificación al montar
            handleVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const handleGenerate = async () => {
        setError("");
        setLoading(true);
        try {
            await userService.generateVerificationToken(email);
            setStep("askToken");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al generar token");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError("");
        setLoading(true);
        try {
            await userService.verifyAccountWithToken(email, token);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Token inválido o expirado");
            if (step === "verifying") {
                setStep("askToken");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 pt-4 relative max-w-md mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-black hover:underline mb-4"
            >
                <FaArrowLeft className="mr-2" /> Volver
            </button>

            <h2 className="text-2xl font-bold text-red-700 text-center mt-12 mb-6">
                Verificación de cuenta
            </h2>

            {step === "askEmail" && (
                <div>
                    <label className="block font-semibold mb-1">Correo electrónico:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className="w-full border rounded p-2 mb-4"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!email || loading}
                        className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition"
                    >
                        {loading ? "Enviando..." : "Enviar token"}
                    </button>
                </div>
            )}

            {step === "askToken" && (
                <div>
                    <p className="mb-4">
                        Te hemos enviado un token a <strong>{email}</strong>. Ingresalo aquí:
                    </p>
                    <label className="block font-semibold mb-1">Token de verificación:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => {
                            setToken(e.target.value);
                            setError("");
                        }}
                        className="w-full border rounded p-2 mb-4"
                    />
                    <button
                        onClick={handleVerify}
                        disabled={!token || loading}
                        className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition"
                    >
                        {loading ? "Verificando..." : "Verificar cuenta"}
                    </button>
                </div>
            )}

            {error && <p className="text-red-600 mt-4 text-center">{error} </p>}
        </div>
    );
}
