import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { Match } from '../../../../models/match.model';
import { Player, User, Coach } from '../../../../models/user.model';
import { Field } from '../../../../models/field.model';
import { forkJoin, Observable, map } from 'rxjs';

interface MatchWithDetails extends Match {
  coachName?: string;
  teamAPlayers?: User[];
  teamBPlayers?: User[];
  field?: Field;
}

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  public matches: MatchWithDetails[] = [];

  constructor(private serviceFacade: ServiceFacade) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  private loadMatches(): void {
    this.serviceFacade.getAllMatches().subscribe({
      next: (matches) => {
        // Load details for each match
        const matchDetailsObservables = matches.map(match => 
          this.loadMatchDetails(match)
        );

        forkJoin(matchDetailsObservables).subscribe({
          next: (matchesWithDetails) => {
            this.matches = matchesWithDetails;
          },
          error: (error) => {
            console.error('Error loading match details:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error loading matches:', error);
      }
    });
  }

  private loadMatchDetails(match: Match): Observable<MatchWithDetails> {
    return forkJoin({
      coach: this.serviceFacade.getCoachById(match.idCoach).pipe(
        map(response => {
          if ('data' in response) {
            return response.data as Coach;
          }
          return response as Coach;
        })
      ),
      field: this.serviceFacade.getFieldById(match.idField),
      teamAPlayers: forkJoin(match.idPlayersTeamA.map(id => 
        this.serviceFacade.getUserById(id)
      )),
      teamBPlayers: forkJoin(match.idPlayersTeamB.map(id => 
        this.serviceFacade.getUserById(id)
      ))
    }).pipe(
      map(({ coach, field, teamAPlayers, teamBPlayers }) => ({
        ...match,
        coachName: coach ? `${coach.nombre} ${coach.apellido}` : 'Unknown Coach',
        field,
        teamAPlayers,
        teamBPlayers
      }))
    );
  }
}
