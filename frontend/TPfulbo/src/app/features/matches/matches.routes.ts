import { Routes } from '@angular/router';
// import { DatesListComponent } from './pages/dates-list/dates-list.component';
import {MatchesCreateComponent} from './pages/matches-create/matches-create.component';

export const MATCHES_ROUTES: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./matches-list/matches-list.component').then(m => m.MatchesListComponent)
  // },
  {
    path: 'new/:idFecha',
    loadComponent: () => import('./pages/matches-create/matches-create.component').then(m => m.MatchesCreateComponent)
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./match-detail/match-detail.component').then(m => m.MatchDetailComponent)
  // }
]; 