export interface ReservationInput {
  name: string;
  initDate: string; // formato YYYY-MM-DD
  finishDate: string;
  cantPeople: number;
  email: string;
  phone: string;
  payment: number;
  roomNumber?: string;
  status: string; //ACTIVA, FUTURA o FINALIZADA
  rooms: {
    roomId: number;
    quantity: number;
    assignedRoomNumber?: string | null;
  }[];
}
