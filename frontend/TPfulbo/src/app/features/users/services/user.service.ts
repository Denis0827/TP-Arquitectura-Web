import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, Player, Coach } from '../../../models/user.model';
import { LoginRequest } from '../../../models/requests/auth.request';
import { LoginResponse } from '../../../models/responses/auth.response';
import { CoachResponse, CoachesResponse } from '../../../models/responses/user.response';
import { ApiResponse } from '../../../models/responses/api.response';

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
  private apiUrl = `${environment.apiUrl}api/user`;

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

  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.apiUrl}/coaches`);
  }

  getCoachById(idCoach: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  getPlayerById(playerId: number): Observable<Player> {
    return this.http.get<ApiResponse<Player>>(`${this.apiUrl}/players/${playerId}`).pipe(
      map(response => response.data)
    );
  }

  // Convertir jugador a coach
  createCoach(playerId: number): Observable<CoachResponse> {
    return this.http.post<CoachResponse>(`${this.apiUrl}/players/${playerId}/coach`, {});
  }

  // Eliminar coach
  deleteCoach(idCoach: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  // Eliminar jugador
  deletePlayer(idPlayer: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/players/${idPlayer}`);
  }
} 