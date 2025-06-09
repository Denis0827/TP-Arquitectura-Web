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

  getStatusClass(): string {
    switch (this.date.status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusText(): string {
    switch (this.date.status.toLowerCase()) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return this.date.status;
    }
  }
}
