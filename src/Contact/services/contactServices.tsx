import axios from "axios";
import { Contact } from "../interfaces/ContactInterfaces";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetContact = async (): Promise<Contact> => {
  try {
    const response = await axios.get<Contact>(
      `${BASE_URL}/api/contact`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el contacto", error);
    throw new Error("Error al obtener el contacto");
  }
};

export const SaveContact = async (contact: Contact): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/contact`,
      contact,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error al guardar el contacto", error);
    throw new Error("Error al guardar el contacto");
  }
};
