import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Import models
import { Player, Coach, LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private http: HttpClient) {}

  // Registro de jugador
  registerPlayer(request: PlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(`${this.apiUrl}/register`, request);
  }

  // Login
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  // Convertir jugador a coach
  createCoach(playerId: number): Observable<CoachResponse> {
    return this.http.post<CoachResponse>(`${this.apiUrl}/players/${playerId}/coach`, {});
  }

  // Obtener todos los coaches
  getAllCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>(`${this.apiUrl}/coaches`);
  }

  // Obtener coach por ID
  getCoachById(idCoach: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  // Eliminar coach
  deleteCoach(idCoach: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/coaches/${idCoach}`);
  }

  // Obtener todos los jugadores
  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  // Obtener jugador por ID
  getPlayerById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${idPlayer}`);
  }

  // Eliminar jugador
  deletePlayer(idPlayer: number): Observable<CoachResponse> {
    return this.http.delete<CoachResponse>(`${this.apiUrl}/players/${idPlayer}`);
  }
} 