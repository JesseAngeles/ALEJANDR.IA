import { jwtDecode } from "jwt-decode";

export const tokenService = {
    getToken: (): string | null => localStorage.getItem("token"),
    setToken: (token: string) => localStorage.setItem("token", token),
    removeToken: () => localStorage.removeItem("token"),
    decodeToken: <T = any>(token: string): T => jwtDecode<T>(token),
};
