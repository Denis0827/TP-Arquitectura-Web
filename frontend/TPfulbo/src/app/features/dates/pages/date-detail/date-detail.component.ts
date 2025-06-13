import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { Player } from '../../../../models/user.model';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-date-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './date-detail.component.html',
  styleUrl: './date-detail.component.scss'
})
export class DateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private serviceFacade = inject(ServiceFacade);

  date: ConfirmDate | null = null;
  field: Field | null = null;
  category: Category | null = null;
  players: Player[] = [];
  loading = true;
  error: string | null = null;
  isCoach = false;

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isCoach = this.authService.isCoach();
    const dateId = this.route.snapshot.paramMap.get('id');
    
    if (!dateId) {
      this.error = 'ID de fecha no proporcionado';
      this.loading = false;
      return;
    }

    this.loadDateDetails(parseInt(dateId));
  }

  loadDateDetails(dateId: number) {
    console.log('Loading date details for ID:', dateId);
    this.loading = true;
    this.error = null;

    this.serviceFacade.getCompleteDate(dateId).subscribe({
      next: ({ date, field, category, confirmedPlayers }) => {
        console.log('Complete date data received:', { date, field, category, confirmedPlayers });
        this.date = date;
        this.field = field;
        this.category = category;
        this.players = confirmedPlayers;
        this.loading = false;
        console.log('Loading state set to false');
      },
      error: (error) => {
        console.error('Error loading date details:', error);
        this.error = 'Error al cargar los detalles de la fecha';
        this.loading = false;
        console.log('Loading state set to false due to error');
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  getFormattedDate(): string {
    if (!this.date?.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(): string {
    if (!this.date?.fecha) return '';
    const date = new Date(this.date.fecha);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onBackClick() {
    this.router.navigate(['/dates']);
  }
}
