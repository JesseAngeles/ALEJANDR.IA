import { tokenService } from "./tokenService";

export const forceLogout = () => {
  tokenService.removeToken();
  window.location.href = "/login"; // o donde quieras redirigir
};