import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
 
  constructor() {
  
  }

  // VALIDACIÓN EN FORMULARIO: Define las reglas estrictas en el cliente (campos obligatorios, formato de correo válido y longitud mínima de caracteres)
  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });
 
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);
 
  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }
 
  // VALIDACIÓN FRONTEND: Comprueba si el campo no cumple con las condiciones requeridas
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
 
  // VALIDACIÓN FRONTEND: Evalúa el tipo de error específico detectado por Angular para retornar el mensaje de advertencia exacto
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
 
    if (!control?.errors) return '';
 
    if (control.hasError('required')) {
      return fieldName === 'email' ? 'El correo es requerido' : 'La contraseña es requerida';
    }
 
    if (control.hasError('email')) {
      return 'Ingresa un correo válido';
    }
 
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
 
    return 'Campo inválido';
  }
 
  onSubmit(): void {
    // VALIDACIÓN EN FORMULARIO: Control de seguridad que cancela la petición al servidor si el formulario contiene errores
    if (!this.form.valid) return;
 
    this.error.set(null);
    this.isLoading.set(true);
 
    const { email, password } = this.form.value;
    const info = { email, password};
    console.log('Login info:', info);

    this.authService.login(info).pipe(
      switchMap(() => this.authService.getUserInfo())
    ).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      // VALIDACIÓN FRONTEND: Captura el fallo del proceso de autenticación para activar visualmente la alerta de error general
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(
          err?.error?.message || 'Error al iniciar sesión. Intenta de nuevo.'
        );
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
