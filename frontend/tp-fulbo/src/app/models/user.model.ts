export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string; // Opcional porque no queremos exponer la contraseña en el frontend
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  mail: string;
  contraseña: string;
}

export interface LoginResponse {
  message: string;
  userType: 'Player' | 'Coach';
  userId: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  number?: number;
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  teamIds?: number[];
} 