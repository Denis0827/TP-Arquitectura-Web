import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../../../models/auth.model';

@Component({
  selector: 'app-player-card-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-card-team.component.html',
  styleUrl: './player-card-team.component.scss'
})
export class PlayerCardTeamComponent implements OnChanges {
  @Input() player!: Player;
  @Input() team: 'A' | 'B' | null = null;
  @Output() teamChange = new EventEmitter<{playerId: number, team: 'A' | 'B' | null}>();

  selectedTeam: 'A' | 'B' | null;

  constructor() {
    this.selectedTeam = this.team;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team']) {
      this.selectedTeam = this.team;
      console.log(`Player ${this.player.id} team updated to:`, this.team);
    }
  }

  onTeamChange(newTeam: 'A' | 'B'): void {
    // Si el equipo es el mismo, no hacer nada
    if (this.selectedTeam === newTeam) {
      return;
    }

    // Emitir el evento con el ID del jugador y el nuevo equipo
    this.teamChange.emit({
      playerId: this.player.id,
      team: newTeam
    });
  }
}
