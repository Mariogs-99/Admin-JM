import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { SectionInterface } from "../../shared/interface/sectionInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetEvents = async (): Promise<SectionInterface[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/post/`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: { categoryId: 5 }
            }   
        )
        console.log(response.data)
        return response.data
    }
    catch (error) {
        console.log(error)
        throw new Error("Error al iniciar sesión"); 
    }
}