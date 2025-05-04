import React, { createContext, useContext, useState } from 'react';

// Definir el tipo del contexto
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Definir el tipo de las props de AdminAuthProvider, incluyendo children
interface AdminAuthProviderProps {
  children: React.ReactNode;  // Se asegura de que 'children' sea un tipo de ReactNode
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
