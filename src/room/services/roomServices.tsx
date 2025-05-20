// roomServices.ts

import axios from "axios";
import { RoomResponse, CategoryRoom } from "../interfaces/roomInterface";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Obtener habitaciones (con categoría incluida)
export const GetRooms = async (): Promise<RoomResponse[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/room/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    throw new Error("Error al obtener habitaciones");
  }
};

// ✅ Guardar habitación con imagen
export const SaveRoom = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/room/with-image`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al guardar habitación:", error);
    throw error;
  }
};

// ✅ Actualizar habitación con imagen
export const UpdateRoomWithImage = async (id: number, formData: FormData): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/room/with-image/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al actualizar habitación con imagen:", error);
    throw error;
  }
};

// ✅ Eliminar habitación
export const DeleteRoom = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/room/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar habitación:", error);
    throw error;
  }
};
