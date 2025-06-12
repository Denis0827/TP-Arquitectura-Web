import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private normalizePath(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove trailing slash from baseUrl if present
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    return `${baseUrl}/${cleanPath}`;
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.normalizePath(path));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.normalizePath(path), body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.normalizePath(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.normalizePath(path));
  }
} 