import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { Match } from '../../../../models/match.model';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  public matches: Match[] = [];

  constructor(private serviceFacade: ServiceFacade) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  private loadMatches(): void {
    this.serviceFacade.getAllMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        // Here you might want to show an error message to the user
      }
    });
  }
}
