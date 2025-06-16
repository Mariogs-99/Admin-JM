export interface Restaurant {
  restaurantId: number;

  // Español
  name: string;
  description: string;
  schedule: string;

  // Inglés
  nameEn: string;
  descriptionEn: string;
  scheduleEn: string;

  pdfMenuUrl: string;
  imgUrl: string;
  highlighted: boolean;
}


export interface RestaurantDTO {
  // Español
  name: string;
  description: string;
  schedule: string;

  // Inglés
  nameEn: string;
  descriptionEn: string;
  scheduleEn: string;

  pdfMenuUrl: string;
  imgUrl: string;
  highlighted: boolean;
}
