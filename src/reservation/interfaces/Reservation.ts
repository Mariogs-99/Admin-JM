export interface CategoryRoom {
    categoryRoomId: number;
    nameCategoryEs?: string;
    nameCategoryEn?: string;
    descriptionEs?: string;
    descriptionEn?: string;
}

export interface Reservation {
    reservationId: number;
    initDate: [number, number, number]; // [Año, Mes, Día]
    finishDate: [number, number, number]; // [Año, Mes, Día]
    cantPeople: number;
    email: string;
    phone: string;
    payment: number;
    categoryroom: CategoryRoom;
    room: any | null; // Puedes definir una interfaz para room si tienes su estructura
}