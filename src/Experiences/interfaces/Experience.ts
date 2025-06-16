// interfaces/Experience.ts
export interface Experience {
  experienceId?: number;

  titleEs: string;
  titleEn: string;

  descriptionEs: string;
  descriptionEn: string;

  duration?: string;
  capacity?: number;
  price?: number;

  availableDaysEs?: string;
  availableDaysEn?: string;

  imageUrl?: string;
  active?: boolean;
}

export interface ExperienceDTO {
  titleEs: string;
  titleEn: string;

  descriptionEs: string;
  descriptionEn: string;

  duration?: string;
  capacity?: number;
  price?: number;

  availableDaysEs?: string;
  availableDaysEn?: string;

  imageUrl?: string;
  active?: boolean;
}

