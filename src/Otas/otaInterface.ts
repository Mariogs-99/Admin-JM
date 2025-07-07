
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
