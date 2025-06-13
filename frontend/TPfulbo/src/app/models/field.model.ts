export interface Field {
  idField: number;
  calle: string;
  altura: number;
  capacidad: number;
  botines: string;
  tieneEstacionamiento: boolean;
}

export interface CreateFieldRequest {
  calle: string;
  altura: number;
  capacidad: number;
  botines: string;
  tieneEstacionamiento: boolean;
} 