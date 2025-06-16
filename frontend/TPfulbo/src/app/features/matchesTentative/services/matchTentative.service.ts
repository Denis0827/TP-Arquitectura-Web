import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { MatchTentative } from '../../../models/matchTentative.model';
import { CreateMatchTentativeRequest } from '../../../models/requests/matchTentative.request';
import { CreateMatchTentativeResponse, GetMatchTentativeByIdResponse, ConfirmPlayerResponse, GetAllMatchTentativeResponse, GetConfirmedPlayersResponse } from '../../../models/responses/matchTentative.response';
import { ApiService } from '../../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MatchTentativeService {
  private apiService = inject(ApiService);

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error?.message || 'Ha ocurrido un error');
  }

  getAllMatchTentative(): Observable<MatchTentative[]> {
    console.log('Fetching all matches tentative...');
    return this.apiService.get<GetAllMatchTentativeResponse>('api/MatchTentative').pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(matches => {
        console.log('Matches tentative received:', matches);
        if (!Array.isArray(matches)) {
          console.error('Received data is not an array:', matches);
          throw new Error('Invalid response format: expected an array of matches tentative');
        }
      }),
      catchError(this.handleError)
    );
  }

  getMatchTentativeById(idMatch: number): Observable<MatchTentative> {
    console.log('Fetching match tentative by ID:', idMatch);
    return this.apiService.get<GetMatchTentativeByIdResponse>(`api/MatchTentative/${idMatch}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(match => {
        console.log('Match tentative received:', match);
        if (!match || !match.idMatch) {
          console.error('Invalid match data received:', match);
          throw new Error('Invalid match data received from server');
        }
      }),
      catchError(this.handleError)
    );
  }

  createMatchTentative(idCoach: number, matchTentative: CreateMatchTentativeRequest): Observable<MatchTentative> {
    console.log(`Creating new match tentative for coach ${idCoach}:`, matchTentative);
    return this.apiService.post<CreateMatchTentativeResponse>(`api/MatchTentative/coaches/${idCoach}/createMatch`, matchTentative).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(newMatch => {
        console.log('Match tentative created successfully:', newMatch);
      }),
      catchError(this.handleError)
    );
  }

  deleteMatchTentative(idMatch: number): Observable<void> {
    console.log('Deleting match tentative:', idMatch);
    return this.apiService.delete<{ success: boolean; message: string }>(`api/MatchTentative/${idMatch}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      tap(() => {
        console.log('Match tentative deleted successfully');
      }),
      catchError(this.handleError)
    );
  }

  confirmAttendance(idMatch: number, idPlayer: number): Observable<void> {
    console.log('Confirming attendance for match:', idMatch, 'player:', idPlayer);
    return this.apiService.post<ConfirmPlayerResponse>(`api/MatchTentative/${idMatch}/confirm/${idPlayer}`, {}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  cancelConfirmation(idMatch: number, idPlayer: number): Observable<void> {
    console.log('Canceling confirmation for match:', idMatch, 'player:', idPlayer);
    return this.apiService.post<ConfirmPlayerResponse>(`api/MatchTentative/${idMatch}/unconfirm/${idPlayer}`, {}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  getConfirmedPlayers(idMatch: number): Observable<number[]> {
    console.log('Fetching confirmed players for match:', idMatch);
    return this.apiService.get<GetConfirmedPlayersResponse>(`api/MatchTentative/${idMatch}/confirmed`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(players => {
        console.log('Confirmed players received:', players);
        if (!Array.isArray(players)) {
          console.error('Invalid players data received:', players);
          throw new Error('Invalid players data received from server');
        }
      }),
      catchError(this.handleError)
    );
  }
} 