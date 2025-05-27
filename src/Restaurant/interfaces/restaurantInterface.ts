export interface Restaurant {
  restaurantId: number;
  name: string;
  description: string;
  schedule: string;
  pdfMenuUrl: string;
  imgUrl: string;
  highlighted: boolean;
}

export interface RestaurantDTO {
  name: string;
  description: string;
  schedule: string;
  pdfMenuUrl: string;
  imgUrl: string;
  highlighted: boolean;
}

