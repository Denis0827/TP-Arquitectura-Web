import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../models/auth.model'; // Corrected import path

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  dni: string = '';
  birthDate: string = '';
  phone: string = '';
  loading = false;

  // Propiedades para mensajes de error específicos de cada campo
  firstNameError: string = '';
  lastNameError: string = '';
  emailError: string = '';
  emailError2: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  dniError: string = '';
  birthDateError: string = '';
  phoneError: string = '';
  generalError: string = ''; // Para errores generales o de backend

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onBirthDateInput(event: any): void {
    let value = event.target.value.replace(/[^0-9]/g, ''); // Solo números
    if (value.length > 2 && value.charAt(2) !== '/') {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5 && value.charAt(5) !== '/') {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }
    if (value.length > 10) { // Limitar a 10 caracteres (dd/mm/yyyy)
      value = value.substring(0, 10);
    }
    this.birthDate = value;
    this.birthDateError = ''; // Limpiar error al escribir
  }

  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2 && value.charAt(2) !== '-') {
      value = value.substring(0, 2) + '-' + value.substring(2);
    }
    if (value.length > 7 && value.charAt(7) !== '-') {
      value = value.substring(0, 7) + '-' + value.substring(7);
    }
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    this.phone = value;
    this.phoneError = ''; // Limpiar error al escribir
  }

  private validateEmail(email: string): boolean {
    return /.+@.+\..+/.test(email);
  }

  private validateBirthDate(dateString: string): boolean {
    // Se espera formato dd/mm/yyyy
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

    // Validar año de 4 dígitos
    if (year < 1000 || year > new Date().getFullYear()) return false; // Limitar años razonables, no futuros

    // Validar día y mes
    if (day < 1 || day > 31) return false; // La validación de new Date() es más robusta
    if (month < 1 || month > 12) return false;

    // Validar fecha válida (ej. 31 de Febrero) y que la fecha sea pasada
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Para comparar solo la fecha, sin la hora

    // Comprobar si la fecha es realmente válida (ej. 31 de Febrero, 29 de Feb en año no bisiesto)
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return false;
    }

    // Validar que la fecha sea estrictamente pasada (no hoy ni futuro)
    if (date >= today) {
      return false;
    }

    return true;
  }

  private validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'Debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Debe tener al menos una mayúscula.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Debe tener al menos una minúscula.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Debe tener al menos un número.';
    }
    return null; // Contraseña válida
  }

  // Función para limpiar todos los mensajes de error
  private clearErrors(): void {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.emailError2 = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.dniError = '';
    this.birthDateError = '';
    this.phoneError = '';
    this.generalError = '';
  }

  onSubmit() {
    this.clearErrors(); // Limpiar errores al inicio de la validación

    let isValid = true; // Bandera para controlar la validez general

    // Validaciones de campos requeridos (ahora con errores específicos)
    if (!this.firstName) { this.firstNameError = 'El nombre es requerido.'; isValid = false; }
    if (!this.lastName) { this.lastNameError = 'El apellido es requerido.'; isValid = false; }
    if (!this.email) { this.emailError = 'El email es requerido.'; isValid = false; }
    if (!this.password) { this.passwordError = 'La contraseña es requerida.'; isValid = false; }
    if (!this.confirmPassword) { this.confirmPasswordError = 'Confirmar contraseña es requerido.'; isValid = false; }
    if (!this.dni) { this.dniError = 'El DNI es requerido.'; isValid = false; }
    if (!this.birthDate) { this.birthDateError = 'La fecha de nacimiento es requerida.'; isValid = false; }
    if (!this.phone) { this.phoneError = 'El teléfono es requerido.'; isValid = false; }

    // Validaciones de formato/lógica
    if (this.email && !this.validateEmail(this.email)) {
      this.emailError = 'Ingresa un email válido.'; isValid = false;
    }

    const passwordValidationMessage = this.validatePassword(this.password);
    if (passwordValidationMessage) {
      this.passwordError = passwordValidationMessage; isValid = false;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Las contraseñas no coinciden.'; isValid = false;
    }

    if (this.birthDate && !this.validateBirthDate(this.birthDate)) {
      this.birthDateError = 'Fecha inválida o futura (dd/mm/aaaa).'; isValid = false;
    }

    // Si alguna validación falla, detenerse aquí
    if (!isValid) {
      return;
    }

    this.loading = true;
    this.generalError = ''; // Limpiar error general antes de la llamada a la API

    const newUser: RegisterRequest = {
      Nombre: this.firstName,
      Apellido: this.lastName,
      Mail: this.email,
      Contraseña: this.password, // Cambiado de 'contraseña' a 'password'
      FechaNacimiento: this.birthDate,
      Telefono: this.phone,
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Registration error:', err);
        if (err.error && err.error.message == 'El mail ya está registrado') {
          this.emailError = 'El mail ya está registrado.';
        } else {
          this.generalError = 'Error al registrar. Por favor, intenta de nuevo.';
        }
        this.loading = false;
      }
    });
  }
}
