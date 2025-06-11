export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Player' | 'Coach';
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dni?: string;
  birthDate?: string;
  phone?: string;
}

export interface LoginRequest {
  mail: string;
  contraseña: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userType: 'Player' | 'Coach';
    userId: number;
  };
}

export interface RegisterRequest {
  Mail: string;
  Contraseña: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
  Telefono: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    playerId: number;
  };
}

export interface Player extends User {
  position?: string;
  number?: number;
  teamId?: number;
}

export interface Coach extends User {
  teamIds?: number[];
  experienceYears?: number;
}
