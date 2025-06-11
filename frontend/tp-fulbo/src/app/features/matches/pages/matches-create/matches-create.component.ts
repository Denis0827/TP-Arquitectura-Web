import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDateService } from '../../../../features/dates/services/confirm-date.service';
import { PlayerCardTeamComponent } from '../../components/player-card-team/player-card-team.component';
import { Player } from '../../../../models/auth.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { UserService } from '../../../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';

interface TeamAssignment {
  playerId: number;
  team: 'A' | 'B' | null;
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

  dateId: number = 0;
  confirmedPlayers: Player[] = [];
  loading: boolean = false;
  error: string | null = null;
  teamAssignments: TeamAssignment[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dateId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.dateId) {
      this.error = 'ID de fecha no válido';
      return;
    }
    this.loadConfirmedPlayers();
  }

  private loadConfirmedPlayers(): void {
    this.loading = true;
    this.error = null;
    this.confirmedPlayers = [];
    this.teamAssignments = [];

    this.confirmDateService.getConfirmedPlayers(this.dateId).subscribe({
      next: (playerIds: number[]) => {
        if (!playerIds || playerIds.length === 0) {
          this.error = 'No hay jugadores confirmados para esta fecha';
          this.loading = false;
          return;
        }

        // Crear un array de observables para obtener los detalles de cada jugador
        const playerObservables = playerIds.map(playerId => 
          this.userService.getPlayerById(playerId).pipe(
            tap(player => console.log('Jugador cargado:', player)),
            catchError(error => {
              console.error(`Error al cargar jugador ${playerId}:`, error);
              return of(null);
            })
          )
        );

        // Combinar todos los observables
        forkJoin(playerObservables).subscribe({
          next: (players: (Player | null)[]) => {
            this.confirmedPlayers = players.filter((player): player is Player => 
              player !== null && 
              typeof player.firstName === 'string' && 
              typeof player.lastName === 'string' && 
              typeof player.id === 'number'
            );
            
            if (this.confirmedPlayers.length === 0) {
              this.error = 'No se pudieron cargar los datos de los jugadores';
              return;
            }

            // Inicializar las asignaciones de equipo
            this.teamAssignments = this.confirmedPlayers.map(player => ({
              playerId: player.id,
              team: null
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

  private initializeTeamAssignments(): void {
    this.teamAssignments = this.confirmedPlayers.map(player => ({
      playerId: player.id,
      team: null
    }));
  }

  getPlayerTeam(playerId: number): 'A' | 'B' | null {
    const assignment = this.teamAssignments.find(a => a.playerId === playerId);
    return assignment?.team || null;
  }

  getTeamPlayers(team: 'A' | 'B'): Player[] {
    return this.confirmedPlayers.filter(player => 
      this.teamAssignments.some(a => a.playerId === player.id && a.team === team)
    );
  }

  getUnassignedPlayers(): Player[] {
    return this.confirmedPlayers.filter(player => 
      this.teamAssignments.some(a => a.playerId === player.id && a.team === null)
    );
  }

  onTeamChange(event: { playerId: number; team: 'A' | 'B' | null }): void {
    console.log('Cambio de equipo:', event);
    const assignment = this.teamAssignments.find(a => a.playerId === event.playerId);
    if (assignment) {
      assignment.team = event.team;
      console.log('Asignación actualizada:', assignment);
    }
  }

  createMatch(): void {
    const teamAPlayers = this.getTeamPlayers('A');
    const teamBPlayers = this.getTeamPlayers('B');

    if (teamAPlayers.length === 0 || teamBPlayers.length === 0) {
      this.error = 'Ambos equipos deben tener al menos un jugador';
      return;
    }

    const matchData = {
      dateId: this.dateId,
      teamA: teamAPlayers.map(p => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`
      })),
      teamB: teamBPlayers.map(p => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`
      }))
    };

    console.log('Creando partido con datos:', matchData);
    // TODO: Implementar la creación del partido
  }
}
