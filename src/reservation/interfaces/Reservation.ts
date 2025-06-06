export interface Reservation {
  reservationId: number;
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

  // 🔁 Reemplazamos esto:
  // room: { ... }

  // ✅ Por esto:
  rooms: {
    roomId: number;
    roomName: string;
    quantity: number;
    assignedRoomNumber: string | null;
  }[];
}
