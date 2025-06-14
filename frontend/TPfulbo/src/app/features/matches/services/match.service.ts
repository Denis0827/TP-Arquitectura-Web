import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Match } from '../../../models/match.model';
import { CreateMatchRequest } from '../../../models/requests/match.request';
import { map, catchError } from 'rxjs/operators';
import { CreateMatchResponse } from '../../../models/responses/match.response';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiUrl}api/match`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error?.message || 'Ha ocurrido un error');
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<{ success: boolean; message: string; data: Match[] }>(this.apiUrl).pipe(
      map(response => {

        if (!response.success) {
          throw new Error(response.message || 'Error al obtener los partidos');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getMatchById(idMatch: number): Observable<Match> {
    return this.http.get<{ success: boolean; message: string; data: Match }>(`${this.apiUrl}/${idMatch}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener el partido');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  createMatch(request: CreateMatchRequest): Observable<{ matchId: number }> {
    return this.http.post<CreateMatchResponse>(this.apiUrl+'/createMatch', request).pipe(
      map(response => {
        //print response

        if (!response.success) {
          throw new Error(response.message || 'Error al crear el partido');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getMatchesByTeam(idTeam: number): Observable<Match[]> {
    return this.http.get<{ success: boolean; message: string; data: Match[] }>(`${this.apiUrl}/team/${idTeam}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener los partidos del equipo');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getMatchesByDate(idDate: number): Observable<Match[]> {
    return this.http.get<{ success: boolean; message: string; data: Match[] }>(`${this.apiUrl}/date/${idDate}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener los partidos de la fecha');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }
} 