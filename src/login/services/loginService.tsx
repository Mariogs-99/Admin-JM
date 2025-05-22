import axios from "axios";
import { LoginResponse, LoginRequest } from "../interfaces/loginInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Inicia sesión con usuario y contraseña
 */
export const login = async ({ username, password }: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/api/auth/login`,
      { username, password }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al iniciar sesión");
  }
};

/**
 * Obtiene el token del localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Cierra la sesión enviando el token al backend y limpiando el localStorage
 */
export const logout = async (): Promise<void> => {
  const token = getToken();

  if (!token) {
    console.warn("No se encontró token para cerrar sesión.");
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw new Error("Error al cerrar sesión");
  } finally {
    localStorage.removeItem("token");
  }
};
