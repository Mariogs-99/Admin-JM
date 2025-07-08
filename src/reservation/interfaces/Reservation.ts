export interface Reservation {
  room: any;
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
    price: number;           
    maxCapacity: number;  
    assignedRoomNumber: string | null | undefined;
  }[];
}
