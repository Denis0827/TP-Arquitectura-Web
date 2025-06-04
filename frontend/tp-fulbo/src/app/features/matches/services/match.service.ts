import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Match, CreateMatchRequest, MatchResponse } from '../../../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiUrl}/api/match`;

  constructor(private http: HttpClient) {}

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatchById(idMatch: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${idMatch}`);
  }

  createMatch(request: CreateMatchRequest): Observable<MatchResponse> {
    return this.http.post<MatchResponse>(this.apiUrl, request);
  }

  getMatchesByTeam(idTeam: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/team/${idTeam}`);
  }

  getMatchesByDate(idDate: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/date/${idDate}`);
  }
} 