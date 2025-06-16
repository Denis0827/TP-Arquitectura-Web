import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatchTentativeService } from '../../services/matchTentative.service';
import { MatchTentative } from '../../../../models/matchTentative.model';
import { AuthService } from '../../../auth/services/auth.service';
import { MatchTentativeListCoachCardComponent } from '../../components/matchTentative-list-coach-card/matchTentative-list-coach-card.component';
import { MatchTentativeListPlayerCardComponent } from '../../components/matchTentative-list-player-card/matchTentative-list-player-card.component';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface MatchTentativeWithDetails extends MatchTentative {
  field?: Field;
  category?: Category;
}

@Component({
  selector: 'app-matchTentative-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatchTentativeListCoachCardComponent,
    MatchTentativeListPlayerCardComponent
  ],
  templateUrl: './matchTentative-list.component.html',
  styleUrl: './matchTentative-list.component.scss'
})
export class MatchTentativeListComponent implements OnInit {
  matchTentativeService = inject(MatchTentativeService);
  authService = inject(AuthService);
  router = inject(Router);
  private serviceFacade = inject(ServiceFacade);
  
  matches: MatchTentativeWithDetails[] = [];
  loading = true;
  error: string | null = null;
  isCoach = false;

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login...');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isCoach = this.authService.isCoach();
    console.log('User role:', this.isCoach ? 'Coach' : 'Player');

    console.log('Fetching matches...');
    this.loading = true;
    this.error = null;

    this.matchTentativeService.getAllMatchTentative().pipe(
      switchMap(matches => {
        if (!matches || matches.length === 0) {
          return of([]);
        }
        const observables = matches.map(match => 
          forkJoin({
            match: of(match),
            field: this.serviceFacade.getFieldById(match.idField).pipe(catchError(() => of(undefined))),
            category: this.serviceFacade.getCategoryById(match.idCategory).pipe(catchError(() => of(undefined)))
          }).pipe(
            map(({ match, field, category }) => ({ ...match, field, category }))
          )
        );
        return forkJoin(observables);
      }),
      catchError(error => {
        console.error('Error in matches list component:', error);
        this.error = 'Error al cargar los partidos. Por favor, intenta nuevamente.';
        this.loading = false;
        if (error.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          this.router.navigate(['/auth/login']);
        }
        return of([]);
      })
    ).subscribe({
      next: (matchesWithDetails) => {
        console.log('Raw matches data received:', JSON.stringify(matchesWithDetails, null, 2));
        this.matches = matchesWithDetails.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        console.log('Processed matches:', this.matches);
        this.loading = false;
      }
    });
  }
}
