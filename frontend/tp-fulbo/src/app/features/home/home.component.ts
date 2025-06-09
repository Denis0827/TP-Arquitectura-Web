import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Bienvenido a TP Fulbo</h1>
      <div class="actions">
        <a routerLink="/dates" class="btn">Ver Fechas</a>
        <a routerLink="/users" class="btn">Ver Usuarios</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      text-align: center;
    }
    .actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class HomeComponent {
}
