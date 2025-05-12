import axios from "axios";
import { SectionInterface } from "../interface/sectionInterface";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const saveSection = async({ title, description, categoryId }: SectionInterface):Promise<SectionInterface> => {
    console.log(import.meta.env.BASE_URL)
    try {
        const response = await axios.post<SectionInterface>(
            `${BASE_URL}/api/section/`,
            { title, description, categoryId },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Agregar el token en los headers
                },
            }
        )

        return response.data
    }
    catch(error) {
        throw new Error("Error al guardar description"); 
    }
}
