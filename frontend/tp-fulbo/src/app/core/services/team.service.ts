import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Team {
  id: number;
  name: string;
  description?: string;
  coachId: number;
  players: Player[];
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  number: number;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  coachId: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  coachId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor() {}

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getTeamById(teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${teamId}`);
  }

  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  updateTeam(teamId: number, team: UpdateTeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${teamId}`, team);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}`);
  }

  addPlayerToTeam(teamId: number, player: Player): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/players`, player);
  }

  removePlayerFromTeam(teamId: number, playerId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/players/${playerId}`);
  }

  updatePlayerInTeam(teamId: number, playerId: number, player: Player): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${teamId}/players/${playerId}`, player);
  }
} 