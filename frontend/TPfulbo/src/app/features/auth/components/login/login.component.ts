import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService} from '../../services/auth.service';
import { LoginRequest } from '../../../../models/requests/auth.request';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      Mail: this.username,
      Contraseña: this.password
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        this.loading = false;
      }
    });
  }
}
