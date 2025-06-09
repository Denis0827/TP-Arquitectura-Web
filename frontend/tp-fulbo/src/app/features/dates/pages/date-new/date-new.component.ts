import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';

@Component({
  selector: 'app-date-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-new.component.html',
  styleUrl: './date-new.component.scss'
})
export class DateNewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private datesService = inject(ConfirmDateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  dateForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor() {
    this.dateForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Verificar autenticación y rol
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.authService.isCoach()) {
      this.router.navigate(['/dates']);
      return;
    }
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.dateForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const { fecha, hora } = this.dateForm.value;
    
    // Combinar fecha y hora en un solo string
    const fechaHora = `${fecha}T${hora}`;

    // Crear objeto ConfirmDate con los datos mínimos necesarios
    const newDate: Partial<ConfirmDate> = {
      fecha: fechaHora,
      idPlayers: []
    };

    this.datesService.createDate(newDate as ConfirmDate).subscribe({
      next: () => {
        this.router.navigate(['/dates']);
      },
      error: (error) => {
        console.error('Error creating date:', error);
        this.error = 'Error al crear la fecha. Por favor, intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dates']);
  }
}
