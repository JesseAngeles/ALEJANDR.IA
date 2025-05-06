import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/domain/context/AuthContext"; // 👈 nuevo

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({ email: false, contrasena: false });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 usar login del contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    const erroresActuales = {
      email: email.trim() === '',
      contrasena: contrasena.trim() === '',
    };
    setErrores(erroresActuales);

    if (!erroresActuales.email && !erroresActuales.contrasena) {
      try {
        await login(email, contrasena); // 👈 login real
        navigate("/"); // redirigir al home o dashboard
      } catch (error: any) {
        setErrorMsg(error.message || "Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      {/* Botón regresar */}
      <button onClick={() => navigate("/")} className="self-start mb-4 text-sm flex items-center gap-2">
        <span className="text-xl">←</span> Regresar
      </button>

      {/* Formulario */}
      <h1 className="text-2xl font-bold text-red-800 mb-6">Inicio de sesión</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <div>
          <label className="text-sm font-medium block">
            Correo electrónico*:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </label>
          {errores.email && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        </div>

        <div>
          <label className="text-sm font-medium block">
            Contraseña*:
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </label>
          {errores.contrasena && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        <p className="text-xs text-gray-500">*Campos obligatorios</p>

        <button type="submit" className="bg-cyan-700 text-white font-semibold py-2 rounded-md hover:bg-cyan-800">
          Ingresar
        </button>
      </form>

      {/* Acciones adicionales */}
      <button onClick={() => alert('Recuperar contraseña')} className="text-sm text-red-700 mt-4 hover:underline">
        Olvidé mi contraseña
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium">¿No tienes cuenta?</p>
        <button onClick={() => navigate("/registro")} className="text-cyan-700 font-semibold hover:underline">
          Regístrate
        </button>
      </div>
    </div>
  );
};

export { Login };
