import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      // {
      //   path: 'teams',
      //   loadChildren: () => import('./features/teams/teams.routes').then(m => m.TEAMS_ROUTES),
      //   canActivate: [authGuard]
      // },
      // {
      //   path: 'matches',
      //   loadChildren: () => import('./features/matches/matches.routes').then(m => m.MATCHES_ROUTES),
      //   canActivate: [authGuard]
      // },
      // {
      //   path: 'dates',
      //   loadChildren: () => import('./features/dates/dates.routes').then(m => m.DATES_ROUTES),
      //   canActivate: [authGuard]
      // },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.USER_ROUTES),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
