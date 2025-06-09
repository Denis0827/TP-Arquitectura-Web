import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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
  navItems: NavItem[] = [
    { path: 'home', label: 'Home', icon: '🏠', requiresAuth: false },
    { path: 'matches', label: 'Matches', icon: '⚽', requiresAuth: true },
    { path: 'dates', label: 'Fechas', icon: '📅', requiresAuth: true },
    { path: 'users', label: 'Users', icon: '👤', requiresAuth: true },
    { path: 'teams', label: 'Teams', icon: '👥', requiresAuth: true },
    { path: 'notifications', label: 'Notifications', icon: '🔔', requiresAuth: true },
  ];

  isMenuOpen = false;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`.trim() || this.currentUser.email;
  }

  getUserRole(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role === 'Coach' ? 'Entrenador' : 'Jugador';
  }
}
