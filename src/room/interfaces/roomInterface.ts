// roomInterface.ts

export interface RoomResponse {
  roomId: number;
  nameEs: string;
  maxCapacity: number;
  description: string;
  price: number;
  sizeBed: string;
  quantity: number;
  imageUrl: string | null;
  categoryRoom: {
    categoryRoomId: number;
    nameCategory: string;
    description: string;
    bedInfo?: string;
    roomSize?: string;
    hasTv?: boolean;
    hasAc?: boolean;
    hasPrivateBathroom?: boolean;
  };
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