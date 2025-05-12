import axios from "axios";
import { GalleryItem } from "../interfaces/galleryInterface";
import { getToken } from "../../../login/services/loginService";
import { body } from "framer-motion/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getGalleryByCategory = async (categoryId:string): Promise<GalleryItem[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/gallery/`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                params: { categoryId: categoryId } //categoria id 6 = hotel
            }
        )
        console.log(response.data)
        return response.data
    }
    catch (error) {
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}

export const uploadImage = async (body: any): Promise<void> => {
    console.log("body", body)
    try {
        const response = await axios.post(
            `${BASE_URL}/api/gallery/upload`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        console.log(response.data)
        return response.data
    }
    catch (error) {
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}

export const deleteGalleryImage = async (idImage: any): Promise<void> => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/gallery/${idImage}`,
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
        throw new Error("Error al iniciar sesión"); // Manejo de errores adecuado
    }
}