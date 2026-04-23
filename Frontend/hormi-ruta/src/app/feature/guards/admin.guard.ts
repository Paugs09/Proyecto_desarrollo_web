import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  Swal.fire({
    title: '<span class="block text-center">Acceso denegado</span>',
    html: '<p class="text-center">Solo el personal autorizado puede entrar aquí.</p>',
    imageUrl: 'assets/Hormiga-acceso.png',
    imageWidth: 150,
    confirmButtonColor: '#ec7272',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-[3rem] border-8 border-white shadow-2xl'
    },
    backdrop: `rgba(45, 45, 45, 0.82)`

  }).then(() => {
    router.navigate(['/login']);
  });

  return false;
};