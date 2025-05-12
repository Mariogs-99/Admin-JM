import axios from "axios";
import { Contact } from "../interfaces/ContactInterfaces";
import { getToken } from "../../login/services/loginService";
// import { LoginResponse, LoginRequest } from "../interfaces/loginInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetContact = async (): Promise<Contact[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/contact/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        )
        console.log(response.data)
        return response.data
    }
    catch (error) {
        throw new Error("Error al iniciar sesión");
    }
}

export const SaveContact = async (body: Contact): Promise<void> => {
    console.log(import.meta.env.BASE_URL)
    try {
        await axios.post<Contact>(
            `${BASE_URL}/api/contact/`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        )
        return
    }
    catch (error) {
        console.error(error);
    }
}
