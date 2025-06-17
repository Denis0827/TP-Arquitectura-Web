import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatchService } from '../../features/matches/services/match.service';
import { MatchTentativeService } from '../../features/matchesTentative/services/matchTentative.service';
import { FieldService } from '../../core/services/field.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Match } from '../../models/match.model';
import { Field } from '../../models/field.model';
import { Category } from '../../models/category.model';
import { MatchTentative } from '../../models/matchTentative.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface MatchWithDetails extends Match {
  field?: Field;
  category?: Category;
}

interface MatchTentativeWithDetails extends MatchTentative {
  field?: Field;
  category?: Category;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  confirmedMatches: MatchWithDetails[] = [];
  unconfirmedTentativeMatches: MatchTentativeWithDetails[] = [];
  userId: number | null = null;
  isPlayer: boolean = false;
  isCoach: boolean = false;
  coachTentativeMatches: MatchTentativeWithDetails[] = [];

  constructor(
    private matchService: MatchService,
    private fieldService: FieldService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private matchTentativeService: MatchTentativeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadMatches();
    this.loadUnconfirmedTentativeMatches();
    this.loadCoachTentativeMatches();
  }

  private loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.idUser;
      this.isPlayer = user.role === 'Player';
      this.isCoach = user.role === 'Coach';
    }
  }

  private loadMatches(): void {
    this.matchService.getAllMatches().pipe(
      catchError(err => {
        console.error('Error loading confirmed matches:', err);
        return of([]);
      })
    ).subscribe(matches => {
      if (matches.length === 0) {
        this.confirmedMatches = [];
        return;
      }

      const matchDetails = matches.map(match => {
        return forkJoin({
          field: this.fieldService.getFieldById(match.idField).pipe(catchError(() => of(undefined))),
          category: this.categoryService.getCategoryById(match.idCategory).pipe(catchError(() => of(undefined)))
        }).pipe(
          map(details => ({
            ...match,
            field: details.field,
            category: details.category
          }))
        );
      });

      forkJoin(matchDetails).subscribe({
        next: (matchesWithDetails) => {
          this.confirmedMatches = matchesWithDetails
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        },
        error: (error: any) => {
          console.error('Error loading confirmed match details:', error);
        }
      });
    });
  }

  private loadUnconfirmedTentativeMatches(): void {
    if (!this.isPlayer || !this.userId) {
      this.unconfirmedTentativeMatches = [];
      return;
    }

    this.matchTentativeService.getAllMatchTentative().pipe(
      catchError(err => {
        console.error('Error loading tentative matches:', err);
        return of([]);
      }),
      map(tentativeMatches => tentativeMatches.filter(match => !match.idPlayers.includes(this.userId!)))
    ).subscribe(unconfirmedMatches => {
      if (unconfirmedMatches.length === 0) {
        this.unconfirmedTentativeMatches = [];
        return;
      }

      const tentativeMatchDetails = unconfirmedMatches.map(match => {
        return forkJoin({
          field: this.fieldService.getFieldById(match.idField).pipe(catchError(() => of(undefined))),
          category: this.categoryService.getCategoryById(match.idCategory).pipe(catchError(() => of(undefined)))
        }).pipe(
          map(details => ({
            ...match,
            field: details.field,
            category: details.category
          }))
        );
      });

      forkJoin(tentativeMatchDetails).subscribe({
        next: (matchesWithDetails) => {
          this.unconfirmedTentativeMatches = matchesWithDetails
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        },
        error: (error: any) => {
          console.error('Error loading tentative match details:', error);
        }
      });
    });
  }

  private loadCoachTentativeMatches(): void {
    if (!this.isCoach || !this.userId) {
      this.coachTentativeMatches = [];
      return;
    }

    this.matchTentativeService.getAllMatchTentative().pipe(
      catchError(err => {
        console.error('Error loading coach tentative matches:', err);
        return of([]);
      }),
      map(tentativeMatches => tentativeMatches.filter(match => match.idCoach === this.userId))
    ).subscribe(coachMatches => {
      if (coachMatches.length === 0) {
        this.coachTentativeMatches = [];
        return;
      }

      const coachMatchDetails = coachMatches.map(match => {
        return forkJoin({
          field: this.fieldService.getFieldById(match.idField).pipe(catchError(() => of(undefined))),
          category: this.categoryService.getCategoryById(match.idCategory).pipe(catchError(() => of(undefined)))
        }).pipe(
          map(details => ({
            ...match,
            field: details.field,
            category: details.category
          }))
        );
      });

      forkJoin(coachMatchDetails).subscribe({
        next: (matchesWithDetails) => {
          this.coachTentativeMatches = matchesWithDetails
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        },
        error: (error: any) => {
          console.error('Error loading coach tentative match details:', error);
        }
      });
    });
  }

  confirmAttendance(matchId: number): void {
    if (!this.userId) return;
    this.matchTentativeService.confirmAttendance(matchId, this.userId).subscribe({
      next: () => {
        this.loadUnconfirmedTentativeMatches();
      },
      error: (error: any) => {
        console.error('Error confirming attendance:', error);
      }
    });
  }
}
