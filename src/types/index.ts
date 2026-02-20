export type Category =
  | 'archaeological'
  | 'volcano'
  | 'lake'
  | 'nature'
  | 'colonial'
  | 'beach'
  | 'cave';

export type Department =
  | 'Alta Verapaz'
  | 'Baja Verapaz'
  | 'Chimaltenango'
  | 'Chiquimula'
  | 'El Progreso'
  | 'Escuintla'
  | 'Guatemala'
  | 'Huehuetenango'
  | 'Izabal'
  | 'Jalapa'
  | 'Jutiapa'
  | 'Petén'
  | 'Quetzaltenango'
  | 'Quiché'
  | 'Retalhuleu'
  | 'Sacatepéquez'
  | 'San Marcos'
  | 'Santa Rosa'
  | 'Sololá'
  | 'Suchitepéquez'
  | 'Totonicapán'
  | 'Zacapa';

export interface PlaceImage {
  url: string;
  alt: string;
  attribution?: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: Category;
  department: Department;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: PlaceImage[];
}
