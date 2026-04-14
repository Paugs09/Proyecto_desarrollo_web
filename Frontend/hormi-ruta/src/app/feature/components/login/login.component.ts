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

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });
 
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);
 
  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }
 
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
 
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
    if (!this.form.valid) return;
 
    this.error.set(null);
    this.isLoading.set(true);
 
    const { email, password } = this.form.value;
    const info = { email, password};
    console.log('Login info:', info);

    this.authService.login(info).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
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
