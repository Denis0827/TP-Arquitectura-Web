export interface PlayerRequest {
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  number?: number;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
} 