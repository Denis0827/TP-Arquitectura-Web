import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  date: string;
  time: string;
  location: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  homeTeamScore?: number;
  awayTeamScore?: number;
}

export interface CreateMatchRequest {
  homeTeamId: number;
  awayTeamId: number;
  date: string;
  time: string;
  location: string;
}

export interface UpdateMatchRequest {
  date?: string;
  time?: string;
  location?: string;
  status?: Match['status'];
  homeTeamScore?: number;
  awayTeamScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/matches`;

  constructor() {}

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatchById(matchId: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${matchId}`);
  }

  getTeamMatches(teamId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/team/${teamId}`);
  }

  createMatch(match: CreateMatchRequest): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  updateMatch(matchId: number, match: UpdateMatchRequest): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}`, match);
  }

  deleteMatch(matchId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matchId}`);
  }

  updateMatchScore(matchId: number, homeTeamScore: number, awayTeamScore: number): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/score`, {
      homeTeamScore,
      awayTeamScore
    });
  }

  updateMatchStatus(matchId: number, status: Match['status']): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/status`, { status });
  }
} 