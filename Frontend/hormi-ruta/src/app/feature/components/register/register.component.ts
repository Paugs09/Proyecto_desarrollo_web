import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
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

  isUploadingImage = signal(false);
  fotoUrl = signal<string | null>(null);
  avatarSource = signal<'none' | 'file' | 'url'>('none');

  // VALIDACIÓN FRONTEND
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    shippingAddress: [''],
    avatar: ['']
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  // VALIDACIÓN FRONTEND
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    return 'Campo inválido';
  }

  onFileSelected(event: Event): void {
    if (this.avatarSource() === 'url') {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.isUploadingImage.set(true);
      
      this.authService.uploadAvatar(file).subscribe({
        next: (url) => {
          this.fotoUrl.set(url);
          this.form.patchValue({ avatar: url }); 
          this.avatarSource.set('file');
          this.isUploadingImage.set(false);
        },
        error: (err: unknown) => {
          this.isUploadingImage.set(false);
          console.error('Error al subir avatar:', err);
        }
      });
    }
  }

  onAvatarUrlChange(event: Event): void {
    if (this.avatarSource() === 'file') {
      return;
    }
    const input = event.target as HTMLInputElement;
    const value = input.value;
    console.log(value);
    if (value) {
      this.avatarSource.set('url');
      this.fotoUrl.set(value);
      this.form.patchValue({ avatar: value });
    } else {
      this.avatarSource.set('none');
      this.fotoUrl.set(null);
      this.form.patchValue({ avatar: '' });
    }
  }

  clearAvatar(fileInput?: HTMLInputElement): void {
    this.fotoUrl.set(null);
    this.form.patchValue({ avatar: '' });
    this.avatarSource.set('none');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    // VALIDACIÓN FRONTEND
    if (this.form.valid) {
      this.isLoading.set(true);

      this.authService.register(this.form.getRawValue()).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/login']);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          console.error('Error al registrar:', err);
        }
      });
    }
  }
}