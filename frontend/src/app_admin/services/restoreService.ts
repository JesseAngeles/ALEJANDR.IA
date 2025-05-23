// src/app_admin/services/restoreService.ts
import { apiFetch } from "@/app/utils/apiFetch";

const BASE_URL = `${import.meta.env.VITE_ENDPOINT}/restore`;

export const restoreService = {
  // Generar código y enviarlo por correo
  generateToken: async ({ email }: { email: string }) => {
    return await apiFetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Confirmar token y cambiar la contraseña
  restorePasswordWithToken: async ({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }) => {
    return await apiFetch(BASE_URL, {
      method: "PUT",
      body: JSON.stringify({ email, token, newPassword }),
    });
  },
};
