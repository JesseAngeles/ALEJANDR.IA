import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<{ email: boolean; contrasena: boolean }>({
    email: false,
    contrasena: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validar campos
    const erroresActuales = {
      email: email.trim() === '',
      contrasena: contrasena.trim() === '',
    };

    setErrores(erroresActuales);

    const formularioValido = !erroresActuales.email && !erroresActuales.contrasena;

    if (formularioValido) {
      // lógica de login real
      alert(`Iniciando sesión con: ${email}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      {/* Botón regresar */}
      <button
        onClick={() => alert('Regresar')}
        className="self-start mb-4 text-sm flex items-center gap-2"
      >
        <span className="text-xl">←</span> Regresar
      </button>

      {/* Formulario */}
      <h1 className="text-2xl font-bold text-red-800 mb-6">Inicio de sesión</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
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
          {errores.email && (
            <p className="text-sm text-red-600 mt-1">Campo requerido</p>
          )}
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
          {errores.contrasena && (
            <p className="text-sm text-red-600 mt-1">Campo requerido</p>
          )}
        </div>

        <p className="text-xs text-gray-500">*Campos obligatorios</p>

        <button
          type="submit"
          className="bg-cyan-700 text-white font-semibold py-2 rounded-md hover:bg-cyan-800"
        >
          Ingresar
        </button>
      </form>

      {/* Acciones adicionales */}
      <button
        onClick={() => alert('Recuperar contraseña')}
        className="text-sm text-red-700 mt-4 hover:underline"
      >
        Olvide mi contraseña
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium">¿No tienes cuenta?</p>
        <button
          onClick={() => alert('Redirigir a registro')}
          className="text-cyan-700 font-semibold hover:underline"
        >
          Registrate
        </button>
      </div>
    </div>
  );
};

export default Login;
