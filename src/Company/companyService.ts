
import axios from "axios";
import { getToken } from "../login/services/loginService";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//?Obtener datos de la empresa
export const getCompany = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/company`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la empresa:", error);
    throw new Error("No se pudo obtener la información de la empresa");
  }
};

//?Actualizar el estado del DTE (activar/desactivar)
export const updateDteEnabled = async (enabled: boolean) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/company`,
      { dteEnabled: enabled },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar DTE:", error);
    throw new Error("No se pudo actualizar la configuración DTE");
  }
};

//?Actualizar datos generales de la empresa
export const updateCompany = async (companyData: any) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/company`,
      companyData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la empresa:", error);
    throw new Error("No se pudo actualizar la información de la empresa");
  }
};
