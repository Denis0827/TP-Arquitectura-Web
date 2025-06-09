import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ConfirmDate, ConfirmDateRequest, ConfirmDateResponse } from '../../../models/confirm-date.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDateService {
  private apiService = inject(ApiService);

  getAllDates(): Observable<ConfirmDate[]> {
    console.log('Fetching all dates...');
    return this.apiService.get<ConfirmDate[]>('api/ConfirmDate').pipe(
      tap(dates => {
        console.log('Dates received:', dates);
        if (!Array.isArray(dates)) {
          console.error('Received data is not an array:', dates);
          throw new Error('Invalid response format: expected an array of dates');
        }
      }),
      catchError(error => {
        console.error('Error fetching dates:', error);
        return throwError(() => new Error('Failed to fetch dates: ' + (error.message || 'Unknown error')));
      })
    );
  }

  getDateById(idDate: number): Observable<ConfirmDate> {
    console.log('Fetching date by ID:', idDate);
    return this.apiService.get<ConfirmDate>(`api/ConfirmDate/${idDate}`).pipe(
      tap(date => {
        console.log('Date received:', date);
        if (!date || !date.idDate) {
          console.error('Invalid date data received:', date);
          throw new Error('Invalid date data received from server');
        }
      }),
      catchError(error => {
        console.error('Error fetching date by ID:', error);
        return throwError(() => new Error('Failed to fetch date: ' + (error.message || 'Unknown error')));
      })
    );
  }

  createDate(date: ConfirmDate): Observable<ConfirmDate> {
    console.log('Creating new date:', date);
    return this.apiService.post<ConfirmDate>('api/ConfirmDate', date).pipe(
      tap(newDate => {
        console.log('Date created successfully:', newDate);
      }),
      catchError(error => {
        console.error('Error creating date:', error);
        return throwError(() => new Error('Failed to create date: ' + (error.message || 'Unknown error')));
      })
    );
  }

  updateDate(idDate: number, date: ConfirmDate): Observable<ConfirmDate> {
    console.log('Updating date:', { idDate, date });
    return this.apiService.put<ConfirmDate>(`api/ConfirmDate/${idDate}`, date).pipe(
      tap(updatedDate => {
        console.log('Date updated successfully:', updatedDate);
      }),
      catchError(error => {
        console.error('Error updating date:', error);
        return throwError(() => new Error('Failed to update date: ' + (error.message || 'Unknown error')));
      })
    );
  }

  deleteDate(idDate: number): Observable<void> {
    console.log('Deleting date:', idDate);
    return this.apiService.delete<void>(`api/ConfirmDate/${idDate}`).pipe(
      tap(() => {
        console.log('Date deleted successfully');
      }),
      catchError(error => {
        console.error('Error deleting date:', error);
        return throwError(() => new Error('Failed to delete date: ' + (error.message || 'Unknown error')));
      })
    );
  }

  getDatesByPlayer(idPlayer: number): Observable<ConfirmDate[]> {
    console.log('Fetching dates for player:', idPlayer);
    return this.apiService.get<ConfirmDate[]>(`api/ConfirmDate/player/${idPlayer}`).pipe(
      tap(dates => {
        console.log('Player dates received:', dates);
        if (!Array.isArray(dates)) {
          console.error('Received data is not an array:', dates);
          throw new Error('Invalid response format: expected an array of dates');
        }
      }),
      catchError(error => {
        console.error('Error fetching player dates:', error);
        return throwError(() => new Error('Failed to fetch player dates: ' + (error.message || 'Unknown error')));
      })
    );
  }
  // [HttpPost("{idDate}/confirm/{idPlayer}")]
  confirmAttendance(dateId: number, playerId: number): Observable<any> {
    return this.apiService.post(`api/ConfirmDate/${dateId}/confirm/${playerId}`, { dateId,playerId });
  }

  cancelConfirmation(dateId: number, playerId: number): Observable<any> {
    return this.apiService.post(`api/ConfirmDate/${dateId}/cancel`, { playerId });
  }
} 