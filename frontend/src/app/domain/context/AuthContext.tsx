import React, { createContext, useContext, useState, useEffect } from "react";
import { tokenService } from "@/app/utils/tokenService";
import { authService } from "@/app/domain/service/authService";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      try {
        const payload = tokenService.decodeToken(token);
        const isExpired = payload.exp * 1000 < Date.now();
        if (!isExpired) {
          setUser(payload);
        } else {
          tokenService.removeToken();
        }
      } catch (err) {
        tokenService.removeToken();
      }
    }
    setLoading(false);
  }, []);


  const login = async (email: string, password: string) => {
    const token = await authService.login(email, password);
    tokenService.setToken(token);
    const payload = tokenService.decodeToken(token);
    setUser(payload);
  };

  const logout = () => {
    tokenService.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
