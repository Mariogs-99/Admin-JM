// restaurantService.tsx

import axios from "axios";
import { Restaurant } from "../interfaces/restaurantInterface";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Obtener todos los restaurantes
export const GetRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/restaurant`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener restaurantes:", error);
    throw new Error("Error al obtener restaurantes");
  }
};

// ✅ Obtener solo los restaurantes destacados
export const GetHighlightedRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/restaurant/highlighted`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener destacados:", error);
    throw new Error("Error al obtener restaurantes destacados");
  }
};

// ✅ Guardar restaurante (con imagen y PDF)
export const SaveRestaurant = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/restaurant/with-files`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al guardar restaurante:", error);
    throw error;
  }
};

export const UpdateRestaurantWithFiles = async (
  id: number,
  formData: FormData,
  imageFile: File | null,
  pdfFile: File | null
): Promise<void> => {
  try {
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    await axios.put(`${BASE_URL}/api/restaurant/with-files/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al actualizar restaurante:", error);
    throw error;
  }
};


// ✅ Eliminar restaurante
export const DeleteRestaurant = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/restaurant/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar restaurante:", error);
    throw error;
  }
};

// ✅ Subir solo el menú PDF a /menu
export const uploadPdf = async (formData: FormData): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/restaurant/upload-pdf`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Devuelve la ruta relativa del PDF: /menu/nombre.pdf
  } catch (error) {
    console.error("Error al subir PDF:", error);
    throw error;
  }
};
