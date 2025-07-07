
export interface OtaIcalConfig {
  id: number;
  otaName: string;
  icalUrl: string;
  active: boolean;
}

export interface OtaIcalConfigCreateDTO {
  otaName: string;
  icalUrl: string;
  active: boolean;
}

export interface ImportResultDTO {
  importedReservations: {
    uid: string;
    roomName: string;
    dates: string;
  }[];
  rejectedReservations: {
    uid: string;
    roomName: string;
    reason: string;
  }[];
}

