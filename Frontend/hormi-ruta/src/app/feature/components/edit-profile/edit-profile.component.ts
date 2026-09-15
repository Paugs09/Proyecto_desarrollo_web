import { Component, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router); 

  isLoading = signal(false);
  isUploadingImage = signal(false);
  fotoUrl = signal<string | null>(null);
  avatarSource = signal<'none' | 'file' | 'url'>('none');
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  readonly user = this.authService.user;

  // VALIDACIÓN EN FORMULARIO: Define los campos obligatorios para el formulario
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName:  ['', [Validators.required]],
    phoneNumber:     [''],
    shippingAddress: [''],
    avatar:    ['']
  });

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.form.patchValue({
        firstName:       u.firstName       || '',
        lastName:        u.lastName        || '',
        phoneNumber:     u.phone           || '',
        shippingAddress: u.shippingAddress || '',
        avatar:          u.avatar          || ''
      });
      if (u.avatar) {
        this.fotoUrl.set(u.avatar);
        this.avatarSource.set('url');
      } else {
        this.fotoUrl.set(null);
        this.avatarSource.set('none');
      }
    }
  }

  // VALIDACIÓN FRONTEND: Verifica en tiempo real si un campo cumple con sus reglas de validación antes de alertar visualmente al usuario
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  onFileSelected(event: Event): void {
    if (this.avatarSource() === 'url') {
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isUploadingImage.set(true);
    this.authService.uploadAvatar(file).subscribe({
      next: (url) => {
        this.fotoUrl.set(url);
        this.form.patchValue({ avatar: url });
        this.avatarSource.set('file');
        this.isUploadingImage.set(false);
      },
      error: (err: unknown) => {
        console.error('Error al subir avatar:', err);
        this.isUploadingImage.set(false);
      }
    });
  }

  onAvatarUrlChange(event: Event): void {
    if (this.avatarSource() === 'file') {
      return;
    }
    const input = event.target as HTMLInputElement;
    const value = input.value;
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
    // VALIDACIÓN EN FORMULARIO: detiene el envío si el usuario intenta enviar datos vacíos
    if (this.form.invalid) return;

    this.isLoading.set(true);

    this.authService.updateUser(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        Swal.fire({
          imageUrl: 'assets/hormiga-feliz.gif',
          imageWidth: 150,
          title: '¡Perfil actualizado!',
          text: 'Tus datos han sido guardados con éxito.',
          confirmButtonColor: '#3aa394',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      // VALIDACIÓN BACKEND: Captura si el servidor rechazó la actualización por problemas internos o de base de datos
      error: (err: unknown) => {
        this.isLoading.set(false);
        console.error(err);
        Swal.fire({
          imageUrl: 'assets/Hormiga-eliminar.png',
          imageWidth: 150,
          title: '¡Algo salió mal!',
          text: 'No se pudo actualizar el perfil. Intenta de nuevo.',
          confirmButtonColor: '#db7a2a',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      }
    });
  }
}