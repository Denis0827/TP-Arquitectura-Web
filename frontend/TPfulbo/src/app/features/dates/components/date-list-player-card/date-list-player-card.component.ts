import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmDateService } from '../../services/confirm-date.service';

@Component({
  selector: 'app-date-list-player-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './date-list-player-card.component.html',
  styleUrls: ['./date-list-player-card.component.scss']
})

export class DateListPlayerCardComponent implements OnInit {
  @Input() date!: ConfirmDate;
  
  isConfirmed = false;
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private confirmDateService: ConfirmDateService
  ) {}

  ngOnInit() {
    // Verificar si el jugador actual ya confirmó
    const userId = this.authService.getUserId();
    if (userId && this.date.idPlayers) {
      this.isConfirmed = this.date.idPlayers.includes(userId);
    }
  }

  getFormattedDate(): string {
    if (!this.date.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    if (!this.date.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPlayersCount(): number {
    return this.date.idPlayers?.length || 0;
  }

  toggleConfirmation() {
    if (this.loading) return;

    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'Debes iniciar sesión para confirmar asistencia';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isConfirmed) {
      // Cancelar confirmación
      this.confirmDateService.cancelConfirmation(this.date.idDate, userId).subscribe({
        next: () => {
          this.isConfirmed = false;
          if (this.date.idPlayers) {
            this.date.idPlayers = this.date.idPlayers.filter(id => id !== userId);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cancelar confirmación:', err);
          this.error = 'Error al cancelar la confirmación';
          this.loading = false;
        }
      });
    } else {
      // Confirmar asistencia
      this.confirmDateService.confirmAttendance(this.date.idDate, userId).subscribe({
        next: () => {
          this.isConfirmed = true;
          if (!this.date.idPlayers) {
            this.date.idPlayers = [];
          }
          this.date.idPlayers.push(userId);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al confirmar asistencia:', err);
          this.error = 'Error al confirmar asistencia';
          this.loading = false;
        }
      });
    }
  }
}
