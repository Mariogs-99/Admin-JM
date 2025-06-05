export interface ReservationInput {
  name: string;
  initDate: string;
  finishDate: string;
  cantPeople: number;
  email: string;
  phone: string;
  payment: number;
  quantityReserved: number;
  roomId: number;
  roomNumber: string;
}
