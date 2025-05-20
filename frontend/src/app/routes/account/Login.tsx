import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/domain/context/AuthContext";
import { FaArrowLeft } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState({ email: false, contrasena: false });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erroresActuales = {
      email: email.trim() === '',
      contrasena: contrasena.trim() === '',
    };
    setErrores(erroresActuales);

    if (!erroresActuales.email && !erroresActuales.contrasena) {
      try {
        await login(email, contrasena);
        navigate("/");
      } catch (error: any) {
        setErrorMsg(error.message || "Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
        {/* Botón regresar */}
        <button
               onClick={() => navigate(-1)} 
               className="flex items-center text-sm text-black hover:underline mb-4"
             >
               <FaArrowLeft className="mr-2 text-black" />
                       Regresar
             </button>

        {/* Formulario */}
        <h1 className="text-2xl font-bold text-red-800 mb-6 text-center mt-8">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block">
              Correo electrónico:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-blue-50"
            />
            {errores.email && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
          </div>

          <div className="relative">
            <label className="text-sm font-medium block">
              Contraseña:
            </label>
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-blue-50"
            />
            <button
              type="button"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              className="absolute right-2 top-[38px] text-blue-700 text-sm hover:underline"
            >
              {mostrarContrasena ? "Ocultar" : "Mostrar"}
            </button>
            {errores.contrasena && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            className="bg-teal-700 text-white font-semibold py-2 rounded-md hover:bg-teal-800"
          >
            Ingresar
          </button>
        </form>

        <button
          onClick={() => navigate("/password-recovery")}
          className="text-sm text-red-700 mt-4 hover:underline"
        >
          Olvidé mi contraseña
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm font-medium">¿No tienes cuenta?</p>
          <button
            onClick={() => navigate("/registro")}
            className="text-cyan-700 font-semibold hover:underline"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export { Login };
