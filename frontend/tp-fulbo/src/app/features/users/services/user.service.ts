import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Import models
import { Player, Coach } from '../../../models/user.model';
import { PlayerRequest, LoginRequest } from '../../../models/requests/player.request';
import { LoginResponse, PlayerResponse, CoachResponse } from '../../../models/responses/login.response';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/user`;

  constructor() {}


  updateProfile(userId: number, data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data);
  }

  changePassword(userId: number, data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/change-password`, data);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/role`, { role });
  }

  // Registro de jugador
  registerPlayer(request: PlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(`${this.apiUrl}/register`, request);
  }

  // Login
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  // Convertir jugador a coach
  createCoach(playerId: number): Observable<CoachResponse> {
    return this.http.post<CoachResponse>(`${this.apiUrl}/players/${playerId}/coach`, {});
  }

  // Obtener todos los coaches
  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.apiUrl}/coaches`);
  }

  // Obtener coach por ID
  getCoachById(idCoach: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  // Eliminar coach
  deleteCoach(idCoach: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  // Obtener todos los jugadores
  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  // Obtener jugador por ID
  getPlayerById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${idPlayer}`);
  }

  // Eliminar jugador
  deletePlayer(idPlayer: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/players/${idPlayer}`);
  }
} 