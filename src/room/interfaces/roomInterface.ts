// roomInterface.ts

export interface RoomResponse {
  roomId: number;
  name: string;
  maxCapacity: number;
  description: string;
  price: number;
  sizeBed: string;
  quantity: number;
  categoryRoomId: number;
  imageUrl: string | null;
}

// Esta interface se sigue usando para cargar categorías
export interface CategoryRoom {
  categoryRoomId: number;
  nameCategoryEs: string;
  nameCategoryEn: string;
  descriptionEs: string;
  descriptionEn: string;
  maxPeople?: number;
  bedInfo?: string;
  roomSize?: string;
  hasTv?: boolean;
  hasAc?: boolean;
  hasPrivateBathroom?: boolean;
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