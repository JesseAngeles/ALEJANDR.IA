import { tokenService } from "@/app/utils/tokenService";
import { forceLogout } from "@/app/utils/logoutHelper";

const API_URL = `${import.meta.env.VITE_ENDPOINT}/cart`;

export const cartService = {
  getCart: async () => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al obtener el carrito");
    return await res.json();
  },

  addToCart: async (isbn: string, quantity = 1) => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}/${isbn}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al agregar el libro al carrito");
    return await res.json();
  },

  removeFromCart: async (isbn: string) => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}/${isbn}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al eliminar el libro del carrito");
    return await res.json();
  },

  emptyCart: async () => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al vaciar el carrito");
    return await res.json();
  },

  createTicket: async () => {
    const token = tokenService.getToken();
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al crear el ticket");
    return await res.json();
  },

  getBookById: async (id: string) => {
    const token = tokenService.getToken();
    const res = await fetch(`${import.meta.env.VITE_ENDPOINT}/book/id/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      forceLogout();
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    if (!res.ok) throw new Error("Error al obtener el libro por ID");
    return await res.json();
  },

};
