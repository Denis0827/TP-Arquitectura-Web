import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('Login attempt:', this.loginForm.value);

    const credentials = {
      Mail: this.loginForm.value.username,
      Contraseña: this.loginForm.value.password
    };

    this.http.post('http://localhost:5088/api/user/login', credentials)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          window.location.href = 'https://www.google.com';
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