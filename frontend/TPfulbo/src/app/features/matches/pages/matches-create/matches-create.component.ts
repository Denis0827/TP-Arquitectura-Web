import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchTentativeService } from '../../../../features/matchesTentative/services/matchTentative.service';
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
import { MatchTentative } from '../../../../models/matchTentative.model';

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
  private matchTentativeService = inject(MatchTentativeService);
  private userService = inject(UserService);
  private apiService = inject(ApiService);
  private matchService = inject(MatchService);
  private authService = inject(AuthService);

  idMatch: number = 0;
  dateInfo: MatchTentative | null = null;
  confirmedPlayers: Player[] = [];
  loading: boolean = false;
  error: string | null = null;
  teamAssignments: TeamAssignment[] = [];

  constructor() {}

  ngOnInit(): void {
    this.idMatch = Number(this.route.snapshot.paramMap.get('idMatch'));
    if (!this.idMatch) {
      this.error = 'ID de partido no válido';
      return;
    }
    this.loadDateInfo();
  }

  private loadDateInfo(): void {
    this.loading = true;
    this.error = null;

    this.matchTentativeService.getMatchTentativeById(this.idMatch).subscribe({
      next: (date: MatchTentative) => {
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
    this.matchTentativeService.getConfirmedPlayers(this.idMatch).subscribe({
      next: (playerIds: number[]) => {
        if (playerIds.length === 0) {
          this.error = 'No hay jugadores confirmados para esta fecha';
          this.loading = false;
          return;
        }

        const playerObservables = playerIds.map(id => 
          this.userService.getPlayerById(id).pipe(
            catchError(error => {
              console.error(`Error al cargar jugador ${id}:`, error);
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

    this.loading = true;
    this.error = null;

    const createMatchRequest: CreateMatchRequest = {
      idMatchTentative: this.idMatch,
      idPlayersTeamA: teamAPlayerIds,
      idPlayersTeamB: teamBPlayerIds
    };

    console.log('Creando partido con datos:', createMatchRequest);

    this.matchService.createMatch(createMatchRequest).subscribe({
      next: (response: { matchId: number }) => {
        console.log('Partido creado exitosamente:', response);
        this.router.navigate(['/matches']);
      },
      error: (error: Error) => {
        console.error('Error al crear el partido:', error);
        this.error = error.message || 'Error al crear el partido';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
