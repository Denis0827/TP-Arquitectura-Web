export interface User {
  idUser: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  mail: string;
  telefono: string;
  contraseña: string;
  role: 'Player' | 'Coach';
}

export interface Player extends User {
  dni: string;
  edad: number;
}

export interface Coach extends User {
  licencia: string;
  fechaIngreso: string;
  aniosExperiencia: number;
} 