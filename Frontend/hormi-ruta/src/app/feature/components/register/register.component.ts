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

isUploadingImage = signal(false);
fotoUrl = signal<string | null>(null);

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

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  // VALIDACIÓN FRONTEND
  isFieldInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
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
  


  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.isUploadingImage.set(true);
    
    this.authService.uploadAvatar(file).subscribe({
      next: (url) => {
        this.fotoUrl.set(url);
        // PatchValue pone la URL en el campo 'avatar' del JSON de registro
        this.form.patchValue({ avatar: url }); 
        this.isUploadingImage.set(false);
      },
      error: (err) => {
        this.isUploadingImage.set(false);
        console.error("Error al subir avatar:", err);
      }
    });}}


  onSubmit() {
    // VALIDACIÓN FRONTEND
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