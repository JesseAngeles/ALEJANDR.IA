import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { userService } from "@/app/domain/service/userService";
import { FaArrowLeft } from 'react-icons/fa';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneEspecial = /[.\-_+#+@\$?&]/.test(contrasena);
  const tieneLongitud = contrasena.length >= 8;
  const contrasenaCoincide = contrasena === confirmar;

  const campoVacio = (valor: string) => valor.trim() === '';

  const handleSubmit = async () => {
    if (
      campoVacio(nombre) || campoVacio(correo) ||
      !tieneMayuscula || !tieneEspecial || !tieneLongitud ||
      !contrasenaCoincide
    ) return;

    try {
      await userService.post({
        name: `${nombre} ${apellidos}`.trim(),
        email: correo,
        password: contrasena,
      });
      setSuccess(true);
    } catch (err) {
      alert("Error al registrar usuario");
      console.error(err);
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
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border rounded p-2" />
        {campoVacio(nombre) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Apellidos:</label>
        <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Correo electrónico:</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border rounded p-2" />
        {campoVacio(correo) && <p className="text-sm text-red-600 mt-1">Campo requerido</p>}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Contraseña:</label>
        <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="w-full border rounded p-2" />
        <ul className="text-xs mt-1 space-y-1">
          <li className={tieneMayuscula ? 'text-green-600 font-semibold' : 'text-gray-600'}>Aa Mayúscula</li>
          <li className={tieneLongitud ? 'text-green-600 font-semibold' : 'text-gray-600'}>8 caracteres mínimo</li>
          <li className={tieneEspecial ? 'text-green-600 font-semibold' : 'text-gray-600'}>Caracter especial</li>
        </ul>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Confirmar contraseña:</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={`w-full border rounded p-2 ${confirmar && !contrasenaCoincide ? 'border-red-500' : ''}`} />
        {!contrasenaCoincide && confirmar && <p className="text-sm text-red-600 mt-1">La contraseña no coincide</p>}
      </div>

      <button onClick={handleSubmit} className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 transition">
        Registrarse
      </button>

      <div className="text-center mt-6">
        <p className="text-sm font-semibold">¿Ya tienes cuenta?</p>
        <button onClick={() => navigate("/login")} className="text-cyan-700 font-bold hover:underline">Iniciar sesión</button>
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
