import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from '../../features/users/services/user.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { ConfirmDateService } from '../../features/dates/services/confirm-date.service';
import { MatchService } from '../../features/matches/services/match.service';
import { TeamService } from '../../features/teams/services/team.service';
import { FieldService } from './field.service';
import { CategoryService } from './category.service';
import { User, Player, Coach } from '../../models/user.model';
import { LoginRequest, RegisterRequest } from '../../models/requests/auth.request';
import { LoginResponse, RegisterResponse } from '../../models/responses/auth.response';
import { ConfirmDate } from '../../models/confirm-date.model';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Field, CreateFieldRequest } from '../../models/field.model';
import { Category } from '../../models/category.model';
import { CreateDateRequest } from '../../models/requests/confirm-date.request';
import { CreateTeamRequest, UpdateTeamRequest } from '../../features/teams/services/team.service';
import { UpdateUserRequest } from '../../features/users/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceFacade {
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private authService: AuthService,
    private confirmDateService: ConfirmDateService,
    private matchService: MatchService,
    private teamService: TeamService,
    private fieldService: FieldService,
    private categoryService: CategoryService
  ) {}

  // Auth related methods
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser$(): Observable<User | null> {
    return this.authService.currentUser$;
  }

  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  isCoach(): boolean {
    return this.authService.isCoach();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(credentials);
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.authService.register(userData);
  }

  logout(): void {
    this.authService.logout();
  }

  getToken(): string | null {
    return this.authService.getToken();
  }

  getUserId(): number | null {
    return this.authService.getUserId();
  }

  // User related methods
  getAllUsers(): Observable<User[]> {
    return this.userService.getAllUsers();
  }

  getUserById(userId: number): Observable<User> {
    return this.userService.getUserById(userId);
  }

  updateProfile(userId: number, data: UpdateUserRequest): Observable<User> {
    return this.userService.updateProfile(userId, data);
  }

  getAllCoaches(): Observable<Coach[]> {
    return this.userService.getAllCoaches();
  }

  getCoachById(idCoach: number): Observable<Coach> {
    return this.userService.getCoachById(idCoach);
  }

  getAllPlayers(): Observable<Player[]> {
    return this.userService.getAllPlayers();
  }

  // Date related methods
  getDatesByPlayer(idPlayer: number): Observable<ConfirmDate[]> {
    return this.confirmDateService.getDatesByPlayer(idPlayer);
  }

  getConfirmedPlayers(dateId: number): Observable<number[]> {
    return this.confirmDateService.getConfirmedPlayers(dateId);
  }

  createDate(idCoach: number, dateData: CreateDateRequest): Observable<ConfirmDate> {
    return this.confirmDateService.createDate(idCoach, dateData);
  }

  confirmAttendance(dateId: number, playerId: number): Observable<void> {
    return this.confirmDateService.confirmAttendance(dateId, playerId);
  }

  cancelConfirmation(dateId: number, playerId: number): Observable<void> {
    return this.confirmDateService.cancelConfirmation(dateId, playerId);
  }

  // Match related methods
  getMatchesByDate(idDate: number): Observable<Match[]> {
    return this.matchService.getMatchesByDate(idDate);
  }

  getMatchesByTeam(idTeam: number): Observable<Match[]> {
    return this.matchService.getMatchesByTeam(idTeam);
  }

  createMatch(matchData: any): Observable<{ matchId: number }> {
    return this.matchService.createMatch(matchData);
  }

  // Team related methods
  getAllTeams(): Observable<Team[]> {
    return this.teamService.getAllTeams();
  }

  getTeamById(idTeam: number): Observable<Team> {
    return this.teamService.getTeamById(idTeam);
  }

  getTeamsByPlayer(idPlayer: number): Observable<Team[]> {
    return this.teamService.getTeamsByPlayer(idPlayer);
  }

  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.teamService.createTeam(team);
  }

  updateTeam(teamId: number, team: UpdateTeamRequest): Observable<Team> {
    return this.teamService.updateTeam(teamId, team);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.teamService.deleteTeam(teamId);
  }

  // Field related methods
  getAllFields(): Observable<Field[]> {
    return this.fieldService.getAllFields();
  }

  getFieldById(id: number): Observable<Field> {
    return this.fieldService.getFieldById(id);
  }

  getFieldsByBotines(botines: string): Observable<Field[]> {
    return this.fieldService.getFieldsByBotines(botines);
  }

  getFieldsByEstacionamiento(tieneEstacionamiento: boolean): Observable<Field[]> {
    return this.fieldService.getFieldsByEstacionamiento(tieneEstacionamiento);
  }

  createField(field: CreateFieldRequest): Observable<number> {
    return this.fieldService.createField(field);
  }

  deleteField(id: number): Observable<void> {
    return this.fieldService.deleteField(id);
  }

  // Category related methods
  getAllCategories(): Observable<Category[]> {
    return this.categoryService.getAllCategories();
  }

  getCategoryById(id: number): Observable<Category> {
    return this.categoryService.getCategoryById(id);
  }

  createCategory(anio: number, genero: string): Observable<Category> {
    return this.categoryService.createCategory(anio, genero);
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoryService.deleteCategory(id);
  }

  // API utility methods
  get<T>(endpoint: string): Observable<T> {
    return this.apiService.get<T>(endpoint);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.apiService.post<T>(endpoint, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.apiService.put<T>(endpoint, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.apiService.delete<T>(endpoint);
  }
} 