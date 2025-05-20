export interface Reservation {
  reservationId: number;
  name: string;
  initDate: string; // Formato ISO: "YYYY-MM-DD"
  finishDate: string;
  cantPeople: number;
  email: string;
  phone: string;
  payment: number;
  quantityReserved: number;
  creationDate: string; // Si decides mostrarla
  room: {
    roomId: number;
    nameEs: string;
    categoryRoom: {
      nameCategoryEs: string;
    };
  };
}
