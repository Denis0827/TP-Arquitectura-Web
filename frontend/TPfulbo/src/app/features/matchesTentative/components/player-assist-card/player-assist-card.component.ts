import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../../models/user.model';

@Component({
  selector: 'app-player-assist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-assist-card.component.html',
  styleUrl: './player-assist-card.component.scss'
})

export class PlayerAssistCardComponent implements OnInit {
  @Input() player!: Player;
  @Input() isConfirmed: boolean = false;

  ngOnInit() {
    if (!this.player) {
      console.error('Player input is required for PlayerAssistCardComponent');
    }
  }

  getFullName(): string {
    return `${this.player.nombre} ${this.player.apellido}`.trim();
  }

  getInitials(): string {
    const first = this.player.nombre.charAt(0);
    const last = this.player.apellido.charAt(0);
    return `${first}${last}`.toUpperCase();
  }
}
