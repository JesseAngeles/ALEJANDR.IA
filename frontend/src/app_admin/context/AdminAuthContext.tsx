import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string): boolean => {
    if (email === "alejandria.contactanos@gmail.com" && password === "Alejandriamail") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};

export { AdminAuthProvider, useAdminAuth };
