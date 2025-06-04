import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginCredentials {
  Mail: string;
  Contraseña: string;
}

export interface AuthResponse {
  token: string;
  user: any; // You can create a proper User interface later
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if there's a stored token on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Attempting login with:', credentials);
    console.log('API URL:', `${environment.apiUrl}/user/login`);
    
    return this.http.post<AuthResponse>(`${environment.apiUrl}/user/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            console.log('Login successful:', response);
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
          },
          error: (error) => {
            console.error('Login error:', error);
          }
        })
      );
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
} 