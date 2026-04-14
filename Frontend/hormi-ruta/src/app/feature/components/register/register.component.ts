import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    shippingAddress: ['']
  });

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  isFieldInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      this.authService.register(this.form.value).subscribe({
        next: res => {
          this.isLoading.set(false);
          this.router.navigate(['/login']);
        },
        error: err => {
          this.isLoading.set(false);
        }
      });
    }
  }
}
