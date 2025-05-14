import axios from "axios";
import { CategoryRoom, Room } from "../interfaces/roomInterface";
import { getToken } from "../../login/services/loginService";
// import { LoginResponse, LoginRequest } from "../interfaces/loginInterface";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetRooms = async (): Promise<Room[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/room/`,
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

export const SaveRoom = async (body: Room): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/api/room/`, body, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al guardar habitación:", error);
    throw error;
  }
};


export const UpdateRoom = async (id: number, body: Room): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/room/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al actualizar habitación:", error);
    throw error;
  }
};

export const DeleteRoom = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/room/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al eliminar habitación:", error);
    throw error;
  }
};








//!---------------------------------ROOMS IMAGE------------------------------------------------
export const getImagesId = async (id: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/room-img/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          params: {
            roomId: id,
            lang:"es",
          },
        }
      )
      console.log("imageIDs: ",response.data)
      return response.data
    }
    catch (error) {
      console.log(error)
    }
  }
  interface imageInterface {
    imgId: number
  }
  
  export const getRoomImage = async ({ imgId }: imageInterface) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/img/download/${imgId}`,
        {
          responseType:"blob",
        }
      )
      console.log("images: ", response.data)
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl
    }
    catch (error) {
      console.log(error)
    }
  }
  
  export const getRoomImages = async (roomId: number) => {
    try {
      // Obtener la lista de imágenes de la habitación
      const images = await getImagesId(roomId);
  
      if (!images || images.length === 0) {
        console.log("No hay imágenes disponibles.");
        return [];
      }
  
      // Obtener las imágenes usando sus IDs
      const imagePromises = images.map((img: { imgId: number }) => getRoomImage({ imgId: img.imgId }));
  
      // Esperar todas las promesas
      const roomImages = await Promise.all(imagePromises);
      return roomImages;
    } catch (error) {
      console.log("Error obteniendo imágenes:", error);
      return [];
    }
  };