import axios from "axios";
import { LoginResponse, LoginRequest } from "../interfaces/loginInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async({ username, password }: LoginRequest):Promise<LoginResponse> => {
    console.log(import.meta.env.BASE_URL)
    try {
        const response = await axios.post<LoginResponse>(
            `${BASE_URL}/api/auth/login`,
            { username, password }
        )

        return response.data
    }
    catch(error) {
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}

export const getToken = () => {
    return localStorage.getItem("token"); // Guardar el token
}