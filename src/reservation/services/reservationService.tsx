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
        )
        return response.data
    }
    catch (error) {
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}

export const SaveReservations = async (body: Reservation): Promise<void> => {
    try {
        await axios.post<Reservation>(
            `${BASE_URL}/api/reservation/`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Agrega el token en los headers
                    "Content-Type": "application/json", // Asegura el tipo de contenido
                },
            }
        )
        return
    }
    catch (error) {
        console.error(error); // Manejo de errores adecuado
    }
}
