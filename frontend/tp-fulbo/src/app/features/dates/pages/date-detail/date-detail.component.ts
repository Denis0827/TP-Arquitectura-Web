import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { Player } from '../../../../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-date-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './date-detail.component.html',
  styleUrl: './date-detail.component.scss'
})
export class DateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private datesService = inject(ConfirmDateService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  date: ConfirmDate | null = null;
  loading = true;
  error: string | null = null;
  isCoach = false;
  players: Player[] = [];
  confirmedPlayers: number[] = [];

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isCoach = this.authService.isCoach();
    const dateId = this.route.snapshot.paramMap.get('id');
    
    if (!dateId) {
      this.error = 'ID de fecha no proporcionado';
      this.loading = false;
      return;
    }

    this.loadDateDetails(parseInt(dateId));
  }

  loadDateDetails(dateId: number) {
    this.loading = true;
    this.error = null;

    this.datesService.getDateById(dateId).subscribe({
      next: (date: ConfirmDate) => {
        this.date = date;
        this.loadConfirmedPlayers(dateId);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading date details:', error);
        this.error = 'Error al cargar los detalles de la fecha';
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  private loadConfirmedPlayers(dateId: number) {
    this.datesService.getConfirmedPlayers(dateId).subscribe({
      next: (playerIds: number[]) => {
        this.confirmedPlayers = playerIds;
        this.loadPlayersDetails(playerIds);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading confirmed players:', error);
        this.error = 'Error al cargar los jugadores confirmados';
        this.loading = false;
      }
    });
  }

  private loadPlayersDetails(playerIds: number[]) {
    if (playerIds.length === 0) {
      this.loading = false;
      return;
    }

    const playerRequests = playerIds.map(id => 
      this.userService.getPlayerById(id).pipe(
        catchError(error => {
          console.error(`Error loading player ${id}:`, error);
          return of(null);
        })
      )
    );

    forkJoin(playerRequests).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (players) => {
        this.players = players.filter((player): player is Player => player !== null);
      },
      error: (error) => {
        console.error('Error loading players details:', error);
        this.error = 'Error al cargar los detalles de los jugadores';
      }
    });
  }

  getFormattedDate(): string {
    if (!this.date?.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    if (!this.date?.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isPlayerConfirmed(playerId: number): boolean {
    return this.confirmedPlayers.includes(playerId);
  }

  onBackClick(): void {
    this.router.navigate(['/dates']);
  }
}
