import axios from "axios";
import { getToken } from "../../login/services/loginService";
import { CategoryRoom } from "../../room/interfaces/roomInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getRoomCategory = async (): Promise<CategoryRoom[]> => {
  try {
    const response = await axios.get<CategoryRoom[]>(
      `${BASE_URL}/api/category/`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener categorías");
  }
};



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


//! Nuevos Servicios para el apartado de categorias
export const createCategoryRoom = async (data: Partial<CategoryRoom>) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/category-room/`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al crear la categoría");
  }
};

export const updateCategoryRoom = async (id: number, data: Partial<CategoryRoom>) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/category-room/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al actualizar la categoría");
  }
};

export const deleteCategoryRoom = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/category-room/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar la categoría");
  }
};
