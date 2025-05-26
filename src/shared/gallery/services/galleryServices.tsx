import axios from "axios";
import { GalleryItem } from "../interfaces/galleryInterface";
import { getToken } from "../../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllGalleryImages = async (): Promise<GalleryItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/gallery`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al cargar la galería");
  }
};

export const uploadImage = async (formData: FormData): Promise<void> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/gallery/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al subir la imagen");
  }
};

export const deleteGalleryImage = async (idImage: number): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/gallery/${idImage}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar la imagen");
  }
};
