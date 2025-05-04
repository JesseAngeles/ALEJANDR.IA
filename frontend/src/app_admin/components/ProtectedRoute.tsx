import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';

interface ProtectedRouteProps {
  element: JSX.Element; // Este es el componente a renderizar
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = useAuth(); // Obtén el token del contexto

  // Si no hay token, redirige a la página de login
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return element; // Si hay token, renderiza el componente
};

export { ProtectedRoute };
