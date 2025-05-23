import type { User } from "@/app/domain/context/AuthContext";

const API_URL = `${import.meta.env.VITE_ENDPOINT}/user`;

export const authService = {
    // authService.ts
login: async (email: string, password: string): Promise<{ token: string, user: User }> => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error("El correo o la contraseña son incorrectos");
    }
  
    const data = await res.json();
    return {
      token: data.token,
      user: data.user
    };
  }
  
};
 