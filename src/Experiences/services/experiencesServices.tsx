import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { SectionInterface } from "../../shared/interface/sectionInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetExperiences = async (): Promise<SectionInterface[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/post/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                params: { categoryId: 3 }
            }   
        )
        console.log(response.data)
        return response.data
    }
    catch (error) {
        console.log(error)
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}