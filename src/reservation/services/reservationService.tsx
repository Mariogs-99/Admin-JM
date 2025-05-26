import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { Reservation } from "../interfaces/Reservation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Obtener todas las reservas
export const GetReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/reservation/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener reservas:", error.response?.data || error);
    throw new Error("No se pudieron cargar las reservas");
  }
};

// Crear una nueva reserva
export const SaveReservations = async (body: Reservation): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/reservation/`, body, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    console.error("Error al crear la reserva:", error.response?.data || error);
    throw error;
  }
};

// Actualizar una reserva existente
export const UpdateReservation = async (
  id: number,
  body: Reservation
): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/reservation/${id}`, body, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    console.error("Error al actualizar la reserva:", error.response?.data || error);
    throw error;
  }
};

// Eliminar una reserva
export const deleteReservation = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/reservation/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    console.error("Error al eliminar la reserva:", error.response?.data || error);
    throw error;
  }
};


// Obtener habitaciones disponibles según fechas y cantidad de personas
export const GetAvailableRooms = async (
  initDate: string,
  finishDate: string,
  cantPeople: number
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/reservation/available-rooms`,
      {
        headers: getAuthHeaders(),
        params: {
          initDate,
          finishDate,
          cantPeople,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener habitaciones disponibles:", error.response?.data || error);
    throw new Error("No se pudieron cargar las habitaciones disponibles");
  }
};

