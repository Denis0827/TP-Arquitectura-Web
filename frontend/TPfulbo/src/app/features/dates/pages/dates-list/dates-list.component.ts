import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { AuthService } from '../../../auth/services/auth.service';
import { DateListCoachCardComponent } from '../../components/date-list-coach-card/date-list-coach-card.component';
import { DateListPlayerCardComponent } from '../../components/date-list-player-card/date-list-player-card.component';

@Component({
  selector: 'app-dates-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    DateListCoachCardComponent,
    DateListPlayerCardComponent
  ],
  templateUrl: './dates-list.component.html',
  styleUrl: './dates-list.component.scss'
})
export class DatesListComponent implements OnInit {
  datesService = inject(ConfirmDateService);
  authService = inject(AuthService);
  router = inject(Router);
  
  dates: ConfirmDate[] = [];
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

    console.log('Fetching dates...');
    this.loading = true;
    this.error = null;

    this.datesService.getAllDates().subscribe({
      next: (dates) => {
        console.log('Raw dates data received:', JSON.stringify(dates, null, 2));
        this.dates = dates;
        console.log('Processed dates:', this.dates);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error in dates list component:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.error = 'Error al cargar las fechas. Por favor, intenta nuevamente.';
        this.loading = false;
        if (error.status === 401) {
          console.log('Unauthorized, redirecting to login...');
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}
