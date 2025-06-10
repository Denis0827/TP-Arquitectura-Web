import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { PlayerAssistCardComponent } from '../../components/player-assist-card/player-assist-card.component';
import { Player } from '../../../../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-date-detail',
  standalone: true,
  imports: [CommonModule, PlayerAssistCardComponent],
  templateUrl: './date-detail.component.html',
  styleUrl: './date-detail.component.scss'
})
export class DateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private datesService = inject(ConfirmDateService);
  private authService = inject(AuthService);

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
      next: (players: number[]) => {
        this.confirmedPlayers = players;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading confirmed players:', error);
        this.error = 'Error al cargar los jugadores confirmados';
        this.loading = false;
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
