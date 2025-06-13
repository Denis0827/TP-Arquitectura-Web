import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDateService } from '../../services/confirm-date.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { ConfirmDate } from '../../../../models/confirm-date.model';
import { CreateDateRequest } from '../../../../models/requests/confirm-date.request';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';

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
  private serviceFacade = inject(ServiceFacade);

  dateForm: FormGroup;
  loading = false;
  error: string | null = null;
  fields: Field[] = [];
  categories: Category[] = [];
  loadingFields = false;
  loadingCategories = false;

  constructor() {
    this.dateForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      idField: ['', [Validators.required]],
      idCategory: ['', [Validators.required]]
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

    // Cargar campos y categorías disponibles
    this.loadFields();
    this.loadCategories();
  }

  loadFields() {
    this.loadingFields = true;
    this.serviceFacade.getAllFields().subscribe({
      next: (fields) => {
        this.fields = fields;
        this.loadingFields = false;
      },
      error: (error) => {
        console.error('Error loading fields:', error);
        this.error = 'Error al cargar los campos disponibles';
        this.loadingFields = false;
      }
    });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.serviceFacade.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Error al cargar las categorías disponibles';
        this.loadingCategories = false;
      }
    });
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

    const { fecha, hora, idField, idCategory } = this.dateForm.value;
    
    // Combinar fecha y hora en un solo string
    const fechaHora = `${fecha}T${hora}`;

    const idCoach = this.authService.getUserId(); 

    if (!idCoach) {
      this.error = 'No se pudo obtener el ID del coach. Por favor, inicia sesión.';
      this.loading = false;
      return;
    }

    // Crear objeto CreateDateRequest con los datos necesarios
    const newDate: CreateDateRequest = {
      fecha: fechaHora,
      idField: idField,
      idCategory: idCategory
    };

    this.datesService.createDate(idCoach, newDate).subscribe({
      next: () => {
        this.router.navigate(['/dates']);
      },
      error: (error) => {
        console.error('Error creating date:', error);
        this.error = error.message || 'Error al crear la fecha. Por favor, intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dates']);
  }
}
