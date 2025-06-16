import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { User, Player, Coach } from '../../models/user.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CoachResponse } from '../../models/responses/user.response';
import { ChangePasswordRequest, UpdateUserRequest } from '../../models/requests/user.request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/user`;

  getPlayerById(id: number): Observable<Player> {
    return this.apiService.get<any>(`api/user/players/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return {
          idUser: response.data.idUser,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fechaNacimiento: response.data.fechaNacimiento,
          mail: response.data.mail,
          telefono: response.data.telefono,
          contraseña: response.data.contraseña,
          role: 'Player',
          dni: response.data.dni,
          edad: response.data.edad
        };
      })
    );
  }

  getCoachById(id: number): Observable<Coach> {
    return this.apiService.get<any>(`api/user/coaches/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return {
          idUser: response.data.idUser,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fechaNacimiento: response.data.fechaNacimiento,
          mail: response.data.mail,
          telefono: response.data.telefono,
          contraseña: response.data.contraseña,
          role: 'Coach',
          licencia: response.data.licencia,
          fechaIngreso: response.data.fechaIngreso,
          aniosExperiencia: response.data.aniosExperiencia
        };
      })
    );
  }

  
  updateProfile(userId: number, data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data);
  }

  changePassword(userId: number, data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/change-password`, data);
  }

  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.apiUrl}/coaches`);
  }

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
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