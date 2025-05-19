import axios from "axios";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Interfaz para los eventos
export interface EventDTO {
  id?: number;
  title: string;
  description: string;
  eventDate: string; // ISO (YYYY-MM-DD)
  capacity: number;
  price: number;
  imageUrl?: string;
  active: boolean;
}

// Obtener todos los eventos
export const GetEvents = async (): Promise<EventDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    throw error;
  }
};

// Crear evento con imagen
export const SaveEvent = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/events/with-image`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
};

// Actualizar evento con imagen
export const UpdateEventWithImage = async (id: number, formData: FormData): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/events/with-image/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error("Error al actualizar evento con imagen:", error);
    throw error;
  }
};

// Eliminar evento
export const DeleteEvent = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    throw error;
  }
};


// Vista de eventos del administrador

// Obtener todos los eventos (admin)
export const GetAllEventsAdmin = async (): Promise<EventDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/events/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener eventos (admin):", error);
    throw error;
  }
};

