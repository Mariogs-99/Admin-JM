export interface Reservation {
  reservationId: number;
  reservationCode: string; // ✅ <-- AÑADE ESTO

  name: string;
  initDate: string;
  finishDate: string;
  cantPeople: number;
  email: string;
  phone: string;
  payment: number;
  quantityReserved: number;
  creationDate: string;
  status: string;
  roomNumber: string;

  rooms: {
    roomId: number;
    roomName: string;
    quantity: number;
    assignedRoomNumber: string | null | undefined;
  }[];
}
