import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext'; 
import { jwtDecode } from "jwt-decode"; 

interface ProtectedRouteProps {
  children: JSX.Element; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, logout, isAuthenticated } = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token) {
        const decodedToken: any = jwtDecode(token); 
        const expiryTime = decodedToken?.exp * 1000;
        const currentTime = Date.now();
        if (currentTime > expiryTime) {
          logout(); 
          setLoading(false); 
        } else {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };

    checkTokenExpiry(); 
  }, [token, logout]);

  if (loading) {
    return <div>Cargando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />; 
  }

  return <>{children}</>;
};

export { ProtectedRoute };
