import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmDate } from '../../../../models/confirm-date.model';

@Component({
  selector: 'app-date-list-coach-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './date-list-coach-card.component.html',
  styleUrl: './date-list-coach-card.component.scss'
})
export class DateListCoachCardComponent {
  @Input() date!: ConfirmDate;

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
}
