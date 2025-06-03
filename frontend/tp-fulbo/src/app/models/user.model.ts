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