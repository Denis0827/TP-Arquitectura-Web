import { Routes } from '@angular/router';

export const DATES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dates-list/dates-list.component').then(m => m.DatesListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./date-form/date-form.component').then(m => m.DateFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./date-detail/date-detail.component').then(m => m.DateDetailComponent)
  }
]; 