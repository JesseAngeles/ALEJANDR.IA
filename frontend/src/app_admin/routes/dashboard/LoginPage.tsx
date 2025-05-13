import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app_admin/context/AdminAuthContext"; // Importamos el contexto
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Nuevo estado
  const [error, setError] = useState("");

  const { login } = useAuth(); // Obtenemos la función login del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_ENDPOINT}login`, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        // Guardamos el token en localStorage
        login(token);

        // Redirigimos al homepage
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#820000] mb-6 text-center">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-blue-50"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contraseña:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // 👈 Tipo dinámico
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded bg-blue-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-700"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#007B83] hover:bg-[#00666e] text-white font-semibold py-2 rounded transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };