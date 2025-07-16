import axios from "axios";
import { Dte } from "../interfaces/Dte";
import { getToken } from "../../login/services/loginService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const getDteByReservationCode = async (
  reservationCode: string
): Promise<Dte[]> => {
  const res = await axios.get(
    `${BASE_URL}/api/dtes/by-reservation/${reservationCode}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const getDtePdfBlob = async (reservationId: number): Promise<Blob> => {
  const res = await axios.get(
    `${BASE_URL}/api/dtes/pdf/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: "blob",
    }
  );
  return res.data;
};

