import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDateService } from '../../../../features/dates/services/confirm-date.service';
import { PlayerCardTeamComponent } from '../../components/player-card-team/player-card-team.component';
import { Player } from '../../../../models/user.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { UserService } from '../../../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';
import { MatchService } from '../../services/match.service';
import { CreateMatchRequest } from '../../../../models/requests/match.request';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';

interface TeamAssignment {
  playerId: number;
  team: 'A' | 'B';
}

@Component({
  selector: 'app-matches-create',
  standalone: true,
  imports: [CommonModule, PlayerCardTeamComponent],
  templateUrl: './matches-create.component.html',
  styleUrl: './matches-create.component.scss'
})

export class MatchesCreateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private confirmDateService = inject(ConfirmDateService);
  private userService = inject(UserService);
  private apiService = inject(ApiService);
  private matchService = inject(MatchService);
  private authService = inject(AuthService);

  dateId: number = 0;
  dateInfo: ConfirmDate | null = null;
  confirmedPlayers: Player[] = [];
  loading: boolean = false;
  error: string | null = null;
  teamAssignments: TeamAssignment[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dateId = Number(this.route.snapshot.paramMap.get('idFecha'));
    if (!this.dateId) {
      this.error = 'ID de fecha no válido';
      return;
    }
    this.loadDateInfo();
  }

  private loadDateInfo(): void {
    this.loading = true;
    this.error = null;

    this.confirmDateService.getDateById(this.dateId).subscribe({
      next: (date: ConfirmDate) => {
        this.dateInfo = date;
        this.loadConfirmedPlayers();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar información de la fecha:', error);
        this.error = 'Error al cargar la información de la fecha';
        this.loading = false;
      }
    });
  }

  private loadConfirmedPlayers(): void {
    if (!this.dateInfo) {
      this.error = 'No se pudo cargar la información de la fecha';
      this.loading = false;
      return;
    }

    this.confirmDateService.getConfirmedPlayers(this.dateId).subscribe({
      next: (playerIds: number[]) => {
        if (!playerIds || playerIds.length === 0) {
          this.error = 'No hay jugadores confirmados para esta fecha';
          this.loading = false;
          return;
        }

        const playerObservables = playerIds.map(playerId => 
          this.userService.getPlayerById(playerId).pipe(
            tap(player => console.log('Jugador cargado:', player)),
            catchError(error => {
              console.error(`Error al cargar jugador ${playerId}:`, error);
              return of(null);
            })
          )
        );

        forkJoin(playerObservables).subscribe({
          next: (players: (Player | null)[]) => {
            this.confirmedPlayers = players.filter((player): player is Player => 
              player !== null && 
              typeof player.nombre === 'string' && 
              typeof player.apellido === 'string' && 
              typeof player.idUser === 'number'
            );
            
            if (this.confirmedPlayers.length === 0) {
              this.error = 'No se pudieron cargar los datos de los jugadores';
              return;
            }

            // Inicializar todas las asignaciones de equipo a 'A'
            this.teamAssignments = this.confirmedPlayers.map(player => ({
              playerId: player.idUser,
              team: 'A'
            }));

            console.log('Jugadores confirmados:', this.confirmedPlayers);
            console.log('Asignaciones iniciales:', this.teamAssignments);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error al cargar detalles de jugadores:', error);
            this.error = 'Error al cargar los detalles de los jugadores';
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar jugadores confirmados:', error);
        this.error = 'Error al cargar los jugadores confirmados';
        this.loading = false;
      }
    });
  }

  getTeamPlayers(team: 'A' | 'B'): Player[] {
    return this.confirmedPlayers.filter(player => 
      this.teamAssignments.some(a => a.playerId === player.idUser && a.team === team)
    );
  }

  togglePlayerTeam(playerId: number): void {
    const assignment = this.teamAssignments.find(a => a.playerId === playerId);
    if (assignment) {
      assignment.team = assignment.team === 'A' ? 'B' : 'A';
      console.log('Asignación actualizada:', assignment);
    }
  }

  createMatch(): void {
    if (!this.dateInfo) {
      this.error = 'No se pudo cargar la información de la fecha';
      return;
    }

    const teamAPlayerIds = this.teamAssignments.filter(a => a.team === 'A').map(a => a.playerId);
    const teamBPlayerIds = this.teamAssignments.filter(a => a.team === 'B').map(a => a.playerId);

    if (teamAPlayerIds.length === 0 || teamBPlayerIds.length === 0) {
      this.error = 'Ambos equipos deben tener al menos un jugador';
      return;
    }

    const coachId = this.authService.getUserId();
    if (!coachId) {
      this.error = 'No se pudo obtener el ID del entrenador';
      return;
    }

    const createMatchRequest: CreateMatchRequest = {
      idCoach: coachId,
      idField: this.dateInfo.idField,
      idConfirmDate: this.dateId,
      idCategory: this.dateInfo.idCategory,
      idPlayersTeamA: teamAPlayerIds,
      idPlayersTeamB: teamBPlayerIds
    };

    console.log('Creando partido con datos:', createMatchRequest);

    this.matchService.createMatch(createMatchRequest).subscribe({
      next: (response: { matchId: number }) => {
        console.log('Partido creado exitosamente:', response);
        this.router.navigate(['/matches']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al crear el partido:', error);
        this.error = `Error al crear el partido: ${error.error?.message || error.message}`;
      }
    });
  }
}
