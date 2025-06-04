import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConfirmDate, ConfirmDateRequest, ConfirmDateResponse } from '../../../models/confirm-date.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDateService {
  private apiUrl = `${environment.apiUrl}/api/confirm-date`;

  constructor(private http: HttpClient) {}

  getAllDates(): Observable<ConfirmDate[]> {
    return this.http.get<ConfirmDate[]>(this.apiUrl);
  }

  getDateById(idDate: number): Observable<ConfirmDate> {
    return this.http.get<ConfirmDate>(`${this.apiUrl}/${idDate}`);
  }

  createDate(request: ConfirmDateRequest): Observable<ConfirmDateResponse> {
    return this.http.post<ConfirmDateResponse>(this.apiUrl, request);
  }

  getDatesByPlayer(idPlayer: number): Observable<ConfirmDate[]> {
    return this.http.get<ConfirmDate[]>(`${this.apiUrl}/player/${idPlayer}`);
  }
} 