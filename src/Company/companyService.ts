import axios from "axios";
import { getToken } from "../login/services/loginService";
const BASE_URL = import.meta.env.VITE_BASE_URL;

//? Obtener datos de la empresa (sin contraseñas)
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

//? Actualizar el estado del DTE (activar/desactivar)
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

//? Actualizar datos generales de la empresa (sin enviar contraseñas vacías)
export const updateCompany = async (companyData: any) => {
  try {
    const payload = { ...companyData };

    // ⚠️ Eliminar contraseñas si están vacías o no fueron modificadas
    if (!payload.mhPassword || payload.mhPassword.trim() === "") {
      delete payload.mhPassword;
    }
    if (!payload.certPassword || payload.certPassword.trim() === "") {
      delete payload.certPassword;
    }

    const response = await axios.put(`${BASE_URL}/api/company`, payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar la empresa:", error);
    throw new Error("No se pudo actualizar la información de la empresa");
  }
};

//?Subir certificado digital al backend
export const uploadCertificate = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file); 

    const response = await axios.post(`${BASE_URL}/api/company/upload-cert`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al subir el certificado:", error);
    throw new Error("No se pudo subir el certificado");
  }
};
