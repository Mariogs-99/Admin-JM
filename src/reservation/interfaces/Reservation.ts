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
  roomNumber: string; // 🆕 nuevo campo

  room: {
    roomId: number;
    name: string;
    categoryRoom: {
      categoryRoomId: number;
      nameCategoryEs: string;
      descriptionEs: string;
      roomSize: string;
      bedInfo: string;
      hasTv: boolean;
      hasAc: boolean;
      hasPrivateBathroom: boolean;
    };
  };
}
