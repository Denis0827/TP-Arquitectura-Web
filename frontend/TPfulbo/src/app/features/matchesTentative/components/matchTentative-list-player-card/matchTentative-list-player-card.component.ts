import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchTentative } from '../../../../models/matchTentative.model';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { MatchTentativeService } from '../../services/matchTentative.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-matchTentative-list-player-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matchTentative-list-player-card.component.html',
  styleUrls: ['./matchTentative-list-player-card.component.scss']
})
export class MatchTentativeListPlayerCardComponent implements OnInit {
  @Input() match!: MatchTentative;
  @Input() displayIndex!: number;
  @Input() field?: Field;
  @Input() category?: Category;
  isConfirmed = false;
  loading = false;
  error: string | null = null;

  constructor(
    private matchTentativeService: MatchTentativeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkConfirmationStatus();
  }

  private checkConfirmationStatus() {
    const playerId = this.authService.getUserId();
    if (playerId) {
      this.matchTentativeService.getConfirmedPlayers(this.match.idMatch).subscribe(
        confirmedPlayers => {
          this.isConfirmed = confirmedPlayers.includes(playerId);
        },
        error => {
          console.error('Error checking confirmation status:', error);
        }
      );
    }
  }

  getFormattedDate(): string {
    if (!this.match.fecha) return '';
    const date = new Date(this.match.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    if (!this.match.fecha) return '';
    const date = new Date(this.match.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPlayersCount(): number {
    return this.match.idPlayers?.length || 0;
  }

  toggleConfirmation() {
    if (this.loading) return;

    const playerId = this.authService.getUserId();
    if (!playerId) {
      this.error = 'Debes iniciar sesión para confirmar asistencia';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isConfirmed) {
      this.matchTentativeService.cancelConfirmation(this.match.idMatch, playerId).subscribe({
        next: () => {
          this.isConfirmed = false;
          if (this.match.idPlayers) {
            this.match.idPlayers = this.match.idPlayers.filter(id => id !== playerId);
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
      this.matchTentativeService.confirmAttendance(this.match.idMatch, playerId).subscribe({
        next: () => {
          this.isConfirmed = true;
          if (!this.match.idPlayers) {
            this.match.idPlayers = [];
          }
          this.match.idPlayers.push(playerId);
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
