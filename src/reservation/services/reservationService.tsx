import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { Reservation } from "../interfaces/Reservation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetReservations = async (): Promise<Reservation[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/reservation/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener reservas");
    }
};

export const SaveReservations = async (body: Reservation): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/api/reservation/`, body, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const UpdateReservation = async (id: number, body: Reservation): Promise<void> => {
    try {
        await axios.put(`${BASE_URL}/api/reservation/${id}`, body, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al actualizar la reserva:", error);
        throw error;
    }
};

export const deleteReservation = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/api/reservation/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        throw error;
    }
};
