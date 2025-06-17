import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../models/user.model';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  navItems: NavItem[] = [
    { path: 'home', label: 'Home', icon: '🏠', requiresAuth: false },
    { path: 'matches', label: 'Mis partidos', icon: '⚽', requiresAuth: true },
    { path: 'matchesTentative', label: 'Partidos tentativos', icon: '📅', requiresAuth: true }
  ];

  coachNavItems: NavItem[] = [
    //{ path: 'users', label: 'Users', icon: '👤', requiresAuth: true },
  ];

  isCoach = false;
  isMenuOpen = false;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isCoach = this.authService.isCoach();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  canNavigate(item: NavItem): boolean {
    return !item.requiresAuth || this.authService.isAuthenticated();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.nombre || '';
    const lastName = this.currentUser.apellido || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Usuario';
  }

  getUserRole(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === 'Coach' ? 'Entrenador' : 'Jugador';
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstName = this.currentUser.nombre || '';
    const lastName = this.currentUser.apellido || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
