import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
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
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/teams', label: 'Teams', icon: '👥' },
    { path: '/matches', label: 'Matches', icon: '⚽' },
    { path: '/dates', label: 'Dates', icon: '📅' },
    { path: '/users', label: 'Users', icon: '👤' }
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor() { }

  ngOnInit(): void { }
}
