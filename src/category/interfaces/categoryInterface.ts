export interface CategoryRoom {
  categoryRoomId: number;
  nameCategoryEs: string;
  nameCategoryEn: string;
  descriptionEs: string;
  descriptionEn: string;

  // Nuevos campos
  maxPeople?: number;
  bedInfo?: string;
  roomSize?: string;
  hasTv?: boolean;
  hasAc?: boolean;
  hasPrivateBathroom?: boolean;
}
