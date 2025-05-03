import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AccountSidebar } from "@/app/routes/account/AccountSideBar";
import { userService } from "@/app/domain/service/userService";
import { useAuth } from "@/app/domain/context/AuthContext";
import { validateUser } from "@/app/validation/user";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await userService.get();
        setName(user.name);
        setEmail(user.email);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password: passwordConfirm,
    };

    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      const formatted: { [key: string]: string } = {};
      validationErrors.forEach((err) => {
        formatted[err.field] = err.message;
      });
      setErrors(formatted);
      return;
    }

    try {
      await userService.update(userData);
      alert("Datos actualizados correctamente");
      setEditMode(false);
      setPasswordConfirm("");
      setErrors({});
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Regresar
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />

        <section className="flex-1">
          <h2 className="text-2xl font-bold text-[#820000] mb-6">Mi perfil</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block font-medium">Nombre*:</label>
              <input
                type="text"
                className="w-full border border-black rounded px-3 py-2 mt-1"
                value={name}
                disabled={!editMode}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium">Correo electrónico:</label>
              <input
                type="email"
                className="w-full border border-black rounded px-3 py-2 mt-1"
                value={email}
                disabled={!editMode}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contraseña (solo si editMode está activo) */}
            {editMode && (
              <div>
                <label className="block font-medium">
                  Confirma tu contraseña*:
                </label>
                <input
                  type="password"
                  className="w-full border border-black rounded px-3 py-2 mt-1"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Botones */}
            <div className="pt-2">
              {editMode ? (
                <button
                  type="submit"
                  className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                >
                  Guardar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                >
                  Editar
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export { Profile };
