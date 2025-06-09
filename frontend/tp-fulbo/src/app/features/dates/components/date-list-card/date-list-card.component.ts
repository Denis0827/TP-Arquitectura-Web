import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmDate } from '../../../../models/confirm-date.model';

@Component({
  selector: 'app-date-list-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './date-list-card.component.html',
  styleUrls: ['./date-list-card.component.scss']
})
export class DateListCardComponent {
  @Input() date!: ConfirmDate;

  getFormattedDate(): string {
    const date = new Date(this.date.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    const date = new Date(this.date.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPlayersCount(): number {
    return this.date.idPlayers.length;
  }
}
