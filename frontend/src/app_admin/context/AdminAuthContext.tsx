import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { jwtDecode } from "jwt-decode";  

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Función para verificar la expiración del token
  const checkTokenExpiry = () => {
    if (token) {
      const decodedToken: any = jwtDecode(token); 
      const expiryTime = decodedToken.exp * 1000; 
      const currentTime = Date.now();
      if (currentTime > expiryTime) {
        logout(); 
      } else {
        setIsAuthenticated(true); 
      }
    }
  };

  useEffect(() => {
    if (token) {
      checkTokenExpiry();
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('jwt_token'); 
    setToken(null);  
    setIsAuthenticated(false);  
  };

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken); 
    setToken(newToken);
    checkTokenExpiry(); 
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
