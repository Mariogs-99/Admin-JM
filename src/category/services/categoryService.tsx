import axios from "axios";
import { CategoryResponseInterface } from "../interfaces/categoryInterface"
import { getToken } from "../../login/services/loginService";
import { CategoryRoom } from "../../room/interfaces/roomInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getRoomCategory = async( ):Promise<CategoryResponseInterface> => {
    try {
        const response = await axios.get<CategoryResponseInterface>(
            `${BASE_URL}/api/category/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Agregar el token en los headers
                },
            }
        )

        return response.data
    }
    catch(error) {
        throw new Error("Error al obtener categorias"); // Manejo de errores adecuado
    }
}


export const getAllCategoriesRoom = async():Promise<CategoryRoom[]> => {
    try {
        const response = await axios.get<CategoryRoom[]>(
            `${BASE_URL}/api/category-room/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Agregar el token en los headers
                },
            }
        )

        return response.data
    }
    catch(error) {
        throw new Error("Error al obtener categorias"); // Manejo de errores adecuado
    }
}