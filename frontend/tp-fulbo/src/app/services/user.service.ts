import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

// Interfaces para las peticiones
export interface PlayerRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  mail: string;
  telefono: string;
  contraseña: string;
}

export interface LoginRequest {
  mail: string;
  contraseña: string;
}

// Interfaces para las respuestas
export interface Player {
  idUser: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  mail: string;
  telefono: string;
}

export interface Coach extends Player {
  // Agrega propiedades específicas del coach si las hay
}

export interface LoginResponse {
  message: string;
  userType: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  // Registro de jugador
  registerPlayer(request: PlayerRequest): Observable<{ message: string; playerId: number }> {
    return this.apiService.post<{ message: string; playerId: number }>('/user/register', request);
  }

  // Login
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/user/login', request);
  }

  // Convertir jugador a coach
  createCoach(playerId: number): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>(`/user/players/${playerId}/coach`, {});
  }

  // Obtener todos los coaches
  getAllCoaches(): Observable<Coach[]> {
    return this.apiService.get<Coach[]>('/user/coaches');
  }

  // Obtener coach por ID
  getCoachById(idCoach: number): Observable<Coach> {
    return this.apiService.get<Coach>(`/user/coaches/${idCoach}`);
  }

  // Eliminar coach
  deleteCoach(idCoach: number): Observable<{ message: string }> {
    return this.apiService.delete<{ message: string }>(`/user/coaches/${idCoach}`);
  }

  // Obtener todos los jugadores
  getAllPlayers(): Observable<Player[]> {
    return this.apiService.get<Player[]>('/user/players');
  }

  // Obtener jugador por ID
  getPlayerById(idPlayer: number): Observable<Player> {
    return this.apiService.get<Player>(`/user/players/${idPlayer}`);
  }

  // Eliminar jugador
  deletePlayer(idPlayer: number): Observable<{ message: string }> {
    return this.apiService.delete<{ message: string }>(`/user/players/${idPlayer}`);
  }
} 