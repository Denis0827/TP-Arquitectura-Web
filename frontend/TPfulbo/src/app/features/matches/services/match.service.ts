import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Match } from '../../../models/match.model';
import { CreateMatchRequest } from '../../../models/requests/match.request';
import { map, catchError } from 'rxjs/operators';
import { CreateMatchResponse, MatchesResponse, GetMatchByIdResponse } from '../../../models/responses/match.response';
import { AuthService } from '../../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiUrl}api/matchConfirmed`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio:', error);
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (error.status === 404) {
        errorMessage = 'No se encontró el recurso solicitado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<MatchesResponse>(this.apiUrl).pipe(
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
    return this.http.get<GetMatchByIdResponse>(`${this.apiUrl}/${idMatch}`).pipe(
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
    const coachId = this.authService.getUserId();
    if (!coachId) {
      return throwError(() => new Error('No se pudo obtener el ID del entrenador'));
    }

    console.log('Enviando request:', request);
    console.log('URL:', `${this.apiUrl}/coaches/${coachId}/createMatch`);

    return this.http.post<CreateMatchResponse>(`${this.apiUrl}/coaches/${coachId}/createMatch`, request).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
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