import { Routes } from '@angular/router';
import { DatesListComponent } from './pages/dates-list/dates-list.component';

export const DATES_ROUTES: Routes = [
  {
    path: '',
    component: DatesListComponent
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/date-new/date-new.component').then(m => m.DateNewComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/date-detail/date-detail.component').then(m => m.DateDetailComponent)
  },
  // {
  //   path: ':id/edit',
  //   loadComponent: () => import('./pages/date-form/date-form.component').then(m => m.DateFormComponent)
  // }
]; 