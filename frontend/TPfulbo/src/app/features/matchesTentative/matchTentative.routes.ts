import { Routes } from '@angular/router';
import { MatchTentativeListComponent } from './pages/matchTentative-list/matchTentative-list.component';

export const MATCHESTENTATIVE_ROUTES: Routes = [
  {
    path: '',
    component: MatchTentativeListComponent
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/matchTentative-new/matchTentative-new.component').then(m => m.MatchTentativeNewComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/matchTentative-detail/matchTentative-detail.component').then(m => m.MatchTentativeDetailComponent)
  },
  // {
  //   path: ':id/edit',
  //   loadComponent: () => import('./pages/date-form/date-form.component').then(m => m.DateFormComponent)
  // }
]; 