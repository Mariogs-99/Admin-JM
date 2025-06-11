import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { Reservation } from "../interfaces/Reservation";
import { ReservationInput } from "./ReservationInput";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// ==============================
// 📦 Interfaces
// ==============================

export interface RoomAssignment {
  roomId: number;
  quantity: number;
  assignedRoomNumber: string;
}

// ==============================
// 📥 Obtener todas las reservas
// ==============================

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

// ==============================
// Crear una nueva reserva
// ==============================

export const SaveReservations = async (body: ReservationInput): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/reservation/`, body, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    console.error("Error al crear la reserva:", error.response?.data || error);
    throw error;
  }
};

// ==============================
// Actualizar reserva
// ==============================

export const UpdateReservation = async (
  id: number,
  body: ReservationInput
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

// ==============================
// 🗑️ Eliminar reserva
// ==============================

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

// ==============================
// 📅 Habitaciones disponibles
// ==============================

export const getAvailableRooms = async (
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

// ==============================
// ✅ Asignar múltiples habitaciones
// ==============================

export const assignRoomNumbers = async (
  reservationId: number,
  rooms: RoomAssignment[]
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/reservation/${reservationId}/assign-rooms`,
      rooms,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error: any) {
    console.error("Error al asignar habitaciones:", error.response?.data || error);
    throw error;
  }
};
