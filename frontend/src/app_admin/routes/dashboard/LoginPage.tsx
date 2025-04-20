import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/app_admin/context/AdminAuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/admin");
    } else {
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-blue-50"
              required
            />
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
