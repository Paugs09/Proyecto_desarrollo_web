import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el computed 'isAdmin' del servicio que hizo tu compañero
  if (authService.isAdmin()) {
    return true;
  }

  alert('⚠️ Acceso denegado: Solo personal autorizado.');
  router.navigate(['/login']);
  return false;
};