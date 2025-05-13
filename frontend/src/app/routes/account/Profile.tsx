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
  const [showPassword, setShowPassword] = useState(false);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    if (!passwordConfirm.trim()) {
      setErrors({ password: "Debes confirmar tu contraseña para guardar cambios." });
      return;
    }

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
      setEditMode(false);
      setPasswordConfirm("");
      setErrors({});
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error al actualizar usuario");
    }
  };

  const handleEditClick = () => {
    if (!name.trim()) {
      setErrors({ name: "El nombre no puede estar vacío para editar." });
      return;
    }
    setEditMode(true);
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
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
            <div>
              <label className="block font-medium">Nombre:</label>
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

            {editMode && (
              <div>
                <label className="block font-medium">Confirma tu contraseña:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-black rounded px-3 py-2 mt-1 pr-16"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

            )}
            <button
              onClick={() => navigate("/password-reset")}
              className="text-sm text-[#007B83] mt-4 hover:underline"
            >
              Cambiar contraseña
            </button>

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
                  onClick={handleEditClick}
                  className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
                >
                  Editar
                </button>
              )}
            </div>
          </form>
        </section>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#00000] mb-4">
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

export { Profile };
