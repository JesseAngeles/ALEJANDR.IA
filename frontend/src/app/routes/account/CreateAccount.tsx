import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { userService } from "@/app/domain/service/userService";
import { FaArrowLeft } from 'react-icons/fa';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [correoExistente, setCorreoExistente] = useState('');

  const navigate = useNavigate();

  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneEspecial = /[.\-_+#+@\$?&]/.test(contrasena);
  const tieneLongitud = contrasena.length >= 8;
  const contrasenaCoincide = contrasena === confirmar;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre);
  const apellidosValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos);
  const campoVacio = (valor: string) => valor.trim() === '';

  const handleSubmit = async () => {
    if (
      campoVacio(nombre) || !nombreValido ||
      campoVacio(apellidos) || !apellidosValido ||
      campoVacio(correo) || !correoValido ||
      campoVacio(confirmar) || !contrasenaCoincide ||
      !tieneMayuscula || !tieneEspecial || !tieneLongitud
    ) return;

    try {
      await userService.post({
        name: `${nombre} ${apellidos}`.trim(),
        email: correo,
        password: contrasena,
      });
      navigate(`/verify-account?email=${encodeURIComponent(correo)}`);
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 409) {
        setCorreoExistente("Este correo ya está registrado");
      } else {
        setCorreoExistente("Este correo ya está registrado.intente con uno diferente");
        console.error("Error inesperado:", err);
      }
    }
  };

  return (
    <div className="min-h-screen px-4 pt-4 relative max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-black hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2 text-black" />
        Regresar
      </button>

      <h2 className="text-2xl font-bold text-red-700 text-center mt-12 mb-6">Crear Cuenta</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded p-2"
        />
        {campoVacio(nombre) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        {!campoVacio(nombre) && !nombreValido && (
          <p className="text-sm text-red-600 mt-1">Formato inválido.Utilice letras para el nombre.</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Apellidos:</label>
        <input
          type="text"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          className="w-full border rounded p-2"
        />
        {campoVacio(apellidos) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        {!campoVacio(apellidos) && !apellidosValido && (
          <p className="text-sm text-red-600 mt-1">Formato inválido.Utilice letras para el apellido.</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Correo electrónico:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value);
            setCorreoExistente('');
          }}
          className="w-full border rounded p-2"
        />
        {campoVacio(correo) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        {!campoVacio(correo) && !correoValido && <p className="text-sm text-red-600 mt-1">Correo inválido</p>}
        {correoExistente && <p className="text-sm text-red-600 mt-1">{correoExistente}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Contraseña:</label>
        <div className="relative">
          <input
            type={verContrasena ? "text" : "password"}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full border rounded p-2 pr-20"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
            onClick={() => setVerContrasena((prev) => !prev)}
          >
            {verContrasena ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <ul className="text-xs mt-1 space-y-1">
          <li className={tieneMayuscula ? 'text-green-600 font-semibold' : 'text-gray-600'}>Aa Mayúscula</li>
          <li className={tieneLongitud ? 'text-green-600 font-semibold' : 'text-gray-600'}>8 caracteres mínimo</li>
          <li className={tieneEspecial ? 'text-green-600 font-semibold' : 'text-gray-600'}>Caracter especial</li>
        </ul>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Confirmar contraseña:</label>
        <div className="relative">
          <input
            type={verConfirmar ? "text" : "password"}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className={`w-full border rounded p-2 pr-20 ${confirmar && !contrasenaCoincide ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-blue-600 hover:underline"
            onClick={() => setVerConfirmar((prev) => !prev)}
          >
            {verConfirmar ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {campoVacio(confirmar) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
        {!campoVacio(confirmar) && !contrasenaCoincide && (
          <p className="text-sm text-red-600 mt-1">La contraseña no coincide</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition"
      >
        Registrarse
      </button>

      <div className="text-center mt-6">
        <p className="text-sm font-semibold">¿Ya tienes cuenta?</p>
        <button
          onClick={() => navigate("/login")}
          className="text-cyan-700 font-bold hover:underline"
        >
          Iniciar sesión
        </button>
      </div>

      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-[#007B83] mb-4">Cuenta creada con éxito</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Registro };
