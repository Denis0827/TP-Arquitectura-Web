import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { MatchTentative } from '../../../../models/matchTentative.model';
import { Player } from '../../../../models/user.model';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';
import { RouterModule } from '@angular/router';
import { throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-matchTentative-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matchTentative-detail.component.html',
  styleUrl: './matchTentative-detail.component.scss'
})
export class MatchTentativeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private serviceFacade = inject(ServiceFacade);

  match: MatchTentative | null | undefined = null;
  field: Field | null | undefined = null;
  category: Category | null | undefined = null;
  players: Player[] = [];
  loading = true;
  error: string | null = null;
  isCoach = false;
  displayIndex: number | null = null;

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isCoach = this.authService.isCoach();
    const matchId = this.route.snapshot.paramMap.get('id');
    
    this.route.queryParams.subscribe(params => {
      if (params['displayIndex']) {
        this.displayIndex = parseInt(params['displayIndex'], 10);
      }
    });
    
    if (!matchId) {
      this.error = 'ID de partido no proporcionado';
      this.loading = false;
      return;
    }

    this.loadMatchDetails(parseInt(matchId));
  }

  loadMatchDetails(matchId: number) {
    console.log('Loading match details for ID:', matchId);
    this.loading = true;
    this.error = null;

    this.serviceFacade.getCompleteDate(matchId).pipe(
      timeout(10000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          console.error('La solicitud de detalles del partido ha excedido el tiempo de espera:', err);
          this.error = 'La carga de los detalles del partido tardó demasiado. Por favor, reintenta.';
        } else {
          console.error('Error al cargar los detalles del partido:', err);
          this.error = 'Error al cargar los detalles del partido.';
        }
        console.log('Loading state set to false due to error');
        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => err);
      }),
      finalize(() => {
        this.loading = false;
        console.log('Finalize block executed: Loading set to false');
      })
    ).subscribe({
      next: ({ date: match, field, category, confirmedPlayers }) => {
        console.log('Complete match data received:', { match, field, category, confirmedPlayers });
        this.match = match;
        this.field = field;
        this.category = category;
        this.players = confirmedPlayers || [];
        console.log('Loading state set to false');
        console.log('Current match object:', this.match);
        console.log('Players array length:', this.players.length);
      }
    });
  }

  getFormattedDate(): string {
    if (!this.match?.fecha) return '';
    const date = new Date(this.match.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    if (!this.match?.fecha) return '';
    const date = new Date(this.match.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onBackClick() {
    this.router.navigate(['/matchesTentative']);
  }
}
