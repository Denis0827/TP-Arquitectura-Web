import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../../../models/user.model';

@Component({
  selector: 'app-player-card-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-card-team.component.html',
  styleUrl: './player-card-team.component.scss'
})

export class PlayerCardTeamComponent implements OnChanges {
  @Input() player!: Player;
  @Input() team: 'A' | 'B' = 'A';
  @Output() teamChange = new EventEmitter<{playerId: number, team: 'A' | 'B'}>();

  selectedTeam: 'A' | 'B';

  constructor() {
    this.selectedTeam = this.team;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team']) {
      this.selectedTeam = this.team;
      console.log(`Player ${this.player.idUser} team updated to:`, this.team);
    }
  }

  onTeamChange(newTeam: 'A' | 'B'): void {
    this.teamChange.emit({
      playerId: this.player.idUser,
      team: newTeam
    });
  }
}
