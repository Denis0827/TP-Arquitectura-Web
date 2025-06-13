import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Field, CreateFieldRequest } from '../../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private apiService = inject(ApiService);

  getAllFields(): Observable<Field[]> {
    return this.apiService.get<any>('api/field').pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  getFieldById(id: number): Observable<Field> {
    return this.apiService.get<any>(`api/field/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  getFieldsByBotines(botines: string): Observable<Field[]> {
    return this.apiService.get<any>(`api/field/botines/${botines}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  getFieldsByEstacionamiento(tieneEstacionamiento: boolean): Observable<Field[]> {
    return this.apiService.get<any>(`api/field/estacionamiento/${tieneEstacionamiento}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  createField(field: CreateFieldRequest): Observable<number> {
    return this.apiService.post<any>('api/field', field).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data.idField;
      })
    );
  }

  deleteField(id: number): Observable<void> {
    return this.apiService.delete<any>(`api/field/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
      })
    );
  }
} 