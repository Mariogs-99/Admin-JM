export interface CategoryRoom {
    categoryRoomId: number;
    nameCategoryEs: string,
    nameCategoryEn: string,
    descriptionEs: string,
    descriptionEn: string
}

export interface Room {
    roomId: number;
    nameEs: string;
    nameEn: string;
    maxCapacity: number;
    descriptionEs: string;
    descriptionEn: string;
    price: number;
    categoryRoom: CategoryRoom;
}

export interface RoomCard {
    roomId:number;
    image: any[];
    nameEs: string;
    nameEn: string;
    maxCapacity: number;
    descriptionEs: string;
    descriptionEn: string;
    price: number;
}