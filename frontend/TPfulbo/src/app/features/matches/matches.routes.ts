import { Routes } from '@angular/router';
import {MatchesCreateComponent} from './pages/matches-create/matches-create.component';

export const MATCHES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/match-list/match-list.component').then(m => m.MatchListComponent)
  },
  {
    path: 'new/:idFecha',
    loadComponent: () => import('./pages/matches-create/matches-create.component').then(m => m.MatchesCreateComponent)
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./match-detail/match-detail.component').then(m => m.MatchDetailComponent)
  // }
]; 