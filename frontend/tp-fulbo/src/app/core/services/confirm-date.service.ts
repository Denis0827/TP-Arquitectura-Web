import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DateConfirmation {
  id: number;
  matchId: number;
  teamId: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  responseDate?: string;
  notes?: string;
}

export interface CreateDateConfirmationRequest {
  matchId: number;
  teamId: number;
  notes?: string;
}

export interface UpdateDateConfirmationRequest {
  status: DateConfirmation['status'];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDateService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/confirm-dates`;

  constructor() {}

  getAllConfirmations(): Observable<DateConfirmation[]> {
    return this.http.get<DateConfirmation[]>(this.apiUrl);
  }

  getConfirmationById(confirmationId: number): Observable<DateConfirmation> {
    return this.http.get<DateConfirmation>(`${this.apiUrl}/${confirmationId}`);
  }

  getTeamConfirmations(teamId: number): Observable<DateConfirmation[]> {
    return this.http.get<DateConfirmation[]>(`${this.apiUrl}/team/${teamId}`);
  }

  getMatchConfirmations(matchId: number): Observable<DateConfirmation[]> {
    return this.http.get<DateConfirmation[]>(`${this.apiUrl}/match/${matchId}`);
  }

  createConfirmation(confirmation: CreateDateConfirmationRequest): Observable<DateConfirmation> {
    return this.http.post<DateConfirmation>(this.apiUrl, confirmation);
  }

  updateConfirmation(confirmationId: number, confirmation: UpdateDateConfirmationRequest): Observable<DateConfirmation> {
    return this.http.put<DateConfirmation>(`${this.apiUrl}/${confirmationId}`, confirmation);
  }

  confirmDate(confirmationId: number, notes?: string): Observable<DateConfirmation> {
    return this.http.put<DateConfirmation>(`${this.apiUrl}/${confirmationId}/confirm`, { notes });
  }

  rejectDate(confirmationId: number, notes?: string): Observable<DateConfirmation> {
    return this.http.put<DateConfirmation>(`${this.apiUrl}/${confirmationId}/reject`, { notes });
  }
} 