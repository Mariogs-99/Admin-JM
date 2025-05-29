import axios from "axios";
import { Experience } from "../interfaces/Experience";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Obtener todas las experiencias
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/experience`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener experiencias:", error);
    throw error;
  }
};

// ✅ Obtener una experiencia por ID
export const getExperienceById = async (id: number): Promise<Experience> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/experience/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener experiencia:", error);
    throw error;
  }
};

// ✅ Crear nueva experiencia
export const createExperience = async (experience: Experience): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/experience`, experience, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al crear experiencia:", error);
    throw error;
  }
};

// ✅ Actualizar experiencia
export const updateExperience = async (
  id: number,
  experience: Experience
): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/experience/${id}`, experience, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al actualizar experiencia:", error);
    throw error;
  }
};

// ✅ Eliminar experiencia
export const deleteExperience = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/experience/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar experiencia:", error);
    throw error;
  }
};

// ✅ Subir imagen al backend
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${BASE_URL}/api/experience/upload-image`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.fileName; // nombre del archivo que el backend devuelve
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};
