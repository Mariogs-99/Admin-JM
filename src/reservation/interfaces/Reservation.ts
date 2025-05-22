export interface Reservation {
  reservationId: number;
  name: string;
  initDate: string; // Fecha como string ISO
  finishDate: string;
  cantPeople: number;
  email: string;
  phone: string;
  payment: number;
  quantityReserved: number;
  creationDate: string; // ahora vendrá en formato válido ISO
  room: {
    roomId: number;
    nameEs: string;
    categoryRoom: {
      nameCategoryEs: string;
    };
  };
}
