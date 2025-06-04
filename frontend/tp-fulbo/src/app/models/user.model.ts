export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Opcional porque no queremos exponer la contraseña en el frontend
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
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