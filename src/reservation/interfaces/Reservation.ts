export interface Reservation {
  reservationId: number;
  reservationCode: string;

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
    price: number;           // ✅ nuevo campo necesario para calcular total
    maxCapacity: number;     // ✅ nuevo campo necesario para validar capacidad
    assignedRoomNumber: string | null | undefined;
  }[];
}
