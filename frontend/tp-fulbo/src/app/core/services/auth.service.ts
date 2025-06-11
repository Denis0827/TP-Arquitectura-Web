import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User, RegisterResponse } from '../../models/auth.model';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';
  private readonly IS_COACH_KEY = 'isCoach';

  constructor(
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const storedUser = localStorage.getItem(this.USER_KEY);
      const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

      if (token && storedUser && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        if (expiryTime > Date.now()) {
          try {
            const user = JSON.parse(storedUser);
            this.currentUserSubject.next(user);
            // Si el token está próximo a expirar (menos de 5 minutos), intentar renovarlo
            if (expiryTime - Date.now() < 300000) { // 5 minutos en milisegundos
              this.refreshToken();
            }
          } catch (e) {
            this.clearAuthData();
          }
        } else {
          this.clearAuthData();
        }
      } else {
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.IS_COACH_KEY);
    }
    this.currentUserSubject.next(null);
  }

  private setAuthData(response: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      // Generar un token temporal (en producción esto vendría del backend)
      const tempToken = btoa(`${response.data.userId}:${Date.now()}`);
      localStorage.setItem(this.TOKEN_KEY, tempToken);
      
      // Guardar el usuario
      const user: User = {
        id: response.data.userId,
        email: '',
        firstName: '',
        lastName: '',
        role: response.data.userType
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      // Guardar el tipo de usuario
      const isCoach = response.data.userType === 'Coach';
      localStorage.setItem(this.IS_COACH_KEY, isCoach.toString());
      
      // Calcular y guardar la fecha de expiración (24 horas desde ahora)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
    this.currentUserSubject.next(response.data.userId ? {
      id: response.data.userId,
      email: '',
      firstName: '',
      lastName: '',
      role: response.data.userType
    } : null);
  }

  private refreshToken(): void {
    // Aquí podrías implementar la lógica para renovar el token
    // Por ejemplo, hacer una llamada al backend para obtener un nuevo token
    // Por ahora, simplemente recargamos la página para forzar un nuevo login
    this.logout();
    this.router.navigate(['/auth/login']);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('api/user/login', credentials)
      .pipe(
        switchMap(response => {
          if (!response.success) {
            throw new Error(response.message);
          }

          // Primero guardamos los datos básicos
          const tempToken = btoa(`${response.data.userId}:${Date.now()}`);
          localStorage.setItem(this.TOKEN_KEY, tempToken);
          localStorage.setItem(this.IS_COACH_KEY, (response.data.userType === 'Coach').toString());
          const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
          localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

          // Luego obtenemos los datos completos del usuario
          const endpoint = response.data.userType === 'Coach' ? 'coaches' : 'players';
          return this.apiService.get<any>(`api/user/${endpoint}/${response.data.userId}`).pipe(
            tap(userData => {
              const user: User = {
                id: response.data.userId,
                email: userData.data.email,
                firstName: userData.data.nombre || userData.data.firstName,
                lastName: userData.data.apellido || userData.data.lastName,
                role: response.data.userType
              };
              localStorage.setItem(this.USER_KEY, JSON.stringify(user));
              this.currentUserSubject.next(user);
            }),
            catchError(error => {
              console.error('Error fetching user details:', error);
              // Si falla, al menos guardamos los datos básicos
              const basicUser: User = {
                id: response.data.userId,
                email: '',
                firstName: '',
                lastName: '',
                role: response.data.userType
              };
              localStorage.setItem(this.USER_KEY, JSON.stringify(basicUser));
              this.currentUserSubject.next(basicUser);
              return of(response);
            })
          );
        }),
        catchError(error => {
          this.clearAuthData();
          throw error;
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.apiService.post<RegisterResponse>('api/user/register', userData)
      .pipe(
        tap(response => {
          if (response.success) {
            // Solo redirigir si el registro fue exitoso
            this.router.navigate(['/auth/login']);
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          // Propagar el error con el mensaje del backend
          return throwError(() => ({
            error: {
              message: error.error?.message || 'Error al registrar. Por favor, intenta de nuevo.'
            }
          }));
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (token && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        if (expiryTime > Date.now()) {
          return true;
        }
      }
      this.clearAuthData();
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (token && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        if (expiryTime > Date.now()) {
          return token;
        }
      }
      this.clearAuthData();
    }
    return null;
  }

  isCoach(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const isCoach = localStorage.getItem(this.IS_COACH_KEY);
      return isCoach === 'true';
    }
    return false;
  }

  getUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;
      try {
        const user = JSON.parse(userStr);
        return user.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }
} 