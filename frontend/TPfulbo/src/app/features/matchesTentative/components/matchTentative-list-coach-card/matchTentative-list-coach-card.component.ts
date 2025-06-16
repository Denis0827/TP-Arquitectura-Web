import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchTentative } from '../../../../models/matchTentative.model';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-matchTentative-list-coach-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matchTentative-list-coach-card.component.html',
  styleUrls: ['./matchTentative-list-coach-card.component.scss']
})
export class MatchTentativeListCoachCardComponent {
  @Input() match!: MatchTentative;
  @Input() displayIndex!: number;
  @Input() field?: Field;
  @Input() category?: Category;

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

}
