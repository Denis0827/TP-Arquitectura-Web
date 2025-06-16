import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Team } from '../../../models/team.model';
import { TeamResponse, TeamsResponse } from '../../../models/responses/team.response';
import { Player } from '../../../models/user.model';
import { map, catchError } from 'rxjs/operators';

export interface CreateTeamRequest {
  idPlayers: number[]; // Corregido: solo necesita idPlayers para la creación de un equipo
}

export interface UpdateTeamRequest {
  idPlayers?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}api/team`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<TeamsResponse>(this.apiUrl).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener todos los equipos');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getTeamById(idTeam: number): Observable<Team> {
    return this.http.get<TeamResponse>(`${this.apiUrl}/${idTeam}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener el equipo por ID');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getTeamsByPlayer(idPlayer: number): Observable<Team[]> {
    return this.http.get<TeamsResponse>(`${this.apiUrl}/players/${idPlayer}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener equipos por jugador');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<TeamResponse>(this.apiUrl, team).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al crear el equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  updateTeam(teamId: number, team: UpdateTeamRequest): Observable<Team> {
    return this.http.put<TeamResponse>(`${this.apiUrl}/${teamId}`, team).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al actualizar el equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  deleteTeam(teamId: number): Observable<void> {
    // La API de borrado podría no devolver un TeamResponse, solo un ApiResponse genérico
    return this.http.delete<any>(`${this.apiUrl}/${teamId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar el equipo');
        }
        return;
      }),
      catchError(this.handleError)
    );
  }

  addPlayerToTeam(teamId: number, player: Player): Observable<Team> {
    return this.http.post<TeamResponse>(`${this.apiUrl}/${teamId}/players`, player).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al agregar jugador al equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  removePlayerFromTeam(teamId: number, playerId: number): Observable<Team> {
    return this.http.delete<TeamResponse>(`${this.apiUrl}/${teamId}/players/${playerId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar jugador del equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  updatePlayerInTeam(teamId: number, playerId: number, player: Player): Observable<Team> {
    return this.http.put<TeamResponse>(`${this.apiUrl}/${teamId}/players/${playerId}`, player).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al actualizar jugador en el equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }
} 