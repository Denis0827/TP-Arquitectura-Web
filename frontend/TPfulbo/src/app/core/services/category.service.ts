import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = 'api/category';

  constructor(private apiService: ApiService) {}

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get(this.endpoint).pipe(
      map((response: any) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.apiService.get(`${this.endpoint}/${id}`).pipe(
      map((response: any) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  createCategory(anio: number, genero: string): Observable<Category> {
    return this.apiService.post(this.endpoint, { anio, genero }).pipe(
      map((response: any) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`).pipe(
      map((response: any) => {
        if (!response.success) {
          throw new Error(response.message);
        }
      })
    );
  }
} 