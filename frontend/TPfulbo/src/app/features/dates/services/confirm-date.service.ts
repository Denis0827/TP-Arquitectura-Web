import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { ConfirmDate } from '../../../models/confirm-date.model';
import { CreateDateRequest } from '../../../models/requests/confirm-date.request';
import { CreateDateResponse, GetDateByIdResponse, ConfirmPlayerResponse, GetAllDatesResponse, GetConfirmedPlayersResponse } from '../../../models/responses/confirm-date.response';
import { ApiService } from '../../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ConfirmDateService {
  private apiService = inject(ApiService);

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error?.message || 'Ha ocurrido un error');
  }

  getAllDates(): Observable<ConfirmDate[]> {
    console.log('Fetching all dates...');
    return this.apiService.get<GetAllDatesResponse>('api/ConfirmDate').pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(dates => {
        console.log('Dates received:', dates);
        if (!Array.isArray(dates)) {
          console.error('Received data is not an array:', dates);
          throw new Error('Invalid response format: expected an array of dates');
        }
      }),
      catchError(this.handleError)
    );
  }

  getDateById(idDate: number): Observable<ConfirmDate> {
    console.log('Fetching date by ID:', idDate);
    return this.apiService.get<GetDateByIdResponse>(`api/ConfirmDate/${idDate}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(date => {
        console.log('Date received:', date);
        if (!date || !date.idDate) {
          console.error('Invalid date data received:', date);
          throw new Error('Invalid date data received from server');
        }
      }),
      catchError(this.handleError)
    );
  }

  createDate(idCoach: number, date: CreateDateRequest & { idField: number; idCategory: number }): Observable<ConfirmDate & { idField: number; idCategory: number }> {
    console.log(`Creating new date for coach ${idCoach}:`, date);
    return this.apiService.post<CreateDateResponse>(`api/ConfirmDate/coaches/${idCoach}/createDate`, date).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(newDate => {
        console.log('Date created successfully:', newDate);
      }),
      catchError(this.handleError)
    );
  }

  deleteDate(idDate: number): Observable<void> {
    console.log('Deleting date:', idDate);
    return this.apiService.delete<{ success: boolean; message: string }>(`api/ConfirmDate/${idDate}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      tap(() => {
        console.log('Date deleted successfully');
      }),
      catchError(this.handleError)
    );
  }

  getDatesByPlayer(idPlayer: number): Observable<ConfirmDate[]> {
    console.log('Fetching dates for player:', idPlayer);
    return this.apiService.get<GetAllDatesResponse>(`api/ConfirmDate/player/${idPlayer}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      tap(dates => {
        console.log('Player dates received:', dates);
        if (!Array.isArray(dates)) {
          console.error('Received data is not an array:', dates);
          throw new Error('Invalid response format: expected an array of dates');
        }
      }),
      catchError(this.handleError)
    );
  }

  confirmAttendance(dateId: number, playerId: number): Observable<void> {
    return this.apiService.post<ConfirmPlayerResponse>(`api/ConfirmDate/${dateId}/confirm/${playerId}`, { dateId, playerId }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  cancelConfirmation(dateId: number, playerId: number): Observable<void> {
    return this.apiService.delete<{ success: boolean; message: string }>(`api/ConfirmDate/${dateId}/confirm/${playerId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  getConfirmedPlayers(dateId: number): Observable<number[]> {
    console.log('Fetching confirmed players for date:', dateId);
    return this.apiService.get<GetConfirmedPlayersResponse>(`api/ConfirmDate/${dateId}/players`).pipe(
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