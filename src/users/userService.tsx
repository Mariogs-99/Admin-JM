import axios from "axios";
import { Role, User,UserDTO } from "./userInterface";
import { getToken } from "../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Obtener todos los usuarios
export const GetUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("Error al obtener usuarios");
  }
};

export const SaveUser = async (data: UserDTO): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/user`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const UpdateUser = async (id: number, data: UserDTO): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};


// ✅ Eliminar usuario
export const DeleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const getAuthenticatedUser = async (): Promise<User> => {
  const response = await axios.get(`${BASE_URL}/api/user/by-token`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};


//? Obtener roles

// Obtener lista de roles (solo nombres o id y nombre)
// Obtener lista de roles (solo nombres o id y nombre)
export const GetRoles = async (): Promise<Role[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/roles`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Aquí asumes que la respuesta es Role[]
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw new Error("Error al obtener roles");
  }
};




