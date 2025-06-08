import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dates-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dates-list.component.html',
  styleUrl: './dates-list.component.scss'
})
export class DatesListComponent implements OnInit {
  datesService = inject(ConfirmDateService);
  authService = inject(AuthService);
  router = inject(Router);
  dates: ConfirmDate[] = [];

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.datesService.getAllDates().subscribe({
      next: (dates) => {
        this.dates = dates;
      },
      error: (error) => {
        console.error('Error loading dates:', error);
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}
