
import { ImportResultDTO, OtaIcalConfig, OtaIcalConfigCreateDTO } from "./otaInterface";
import { getToken } from "../login/services/loginService";
import axios, { AxiosResponse } from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Obtener todas las integraciones OTA activas
export const getOtaConfigs = async (): Promise<OtaIcalConfig[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/ota-ical`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener integraciones OTA:", error);
    throw new Error("Error al obtener integraciones OTA");
  }
};

// ✅ Guardar o actualizar una integración OTA
export const saveOtaConfig = async (
  data: OtaIcalConfig | OtaIcalConfigCreateDTO
): Promise<OtaIcalConfig> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/ota-ical`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar integración OTA:", error);
    throw error;
  }
};

// ✅ Eliminar (desactivar) una integración OTA
export const deactivateOtaConfig = async (id: number): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/ota-ical/${id}/deactivate`, {}, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al desactivar integración OTA:", error);
    throw error;
  }
};

// ✅ Eliminar físicamente (opcional, si implementas el delete en backend)
export const deleteOtaConfig = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/ota-ical/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar integración OTA:", error);
    throw error;
  }
};

export const importOtaReservations = async (
  url: string,
  otaName: string
): Promise<ImportResultDTO> => {
  try {
    const response = await axios.post<ImportResultDTO>(
      `${BASE_URL}/api/ical/import`,
      null,
      {
        params: { url, otaName },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al importar reservas OTA:", error);
    throw error;
  }
};
