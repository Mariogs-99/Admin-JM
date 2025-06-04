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
  room: {
    roomId: number;
    name: string; 
    categoryRoom: {
      nameCategory: string; 
    };
  };
}
