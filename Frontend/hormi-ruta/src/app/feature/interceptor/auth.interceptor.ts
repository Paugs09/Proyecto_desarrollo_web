import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const injector = inject(Injector);

  // 1. Si estamos en el servidor (SSR), dejar pasar sin tocar nada
  if (!isPlatformBrowser(platformId)) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ` }
    }));
  }

  // 2. Intentar obtener el token (si existe)
  const token = sessionStorage?.getItem('token') ?? "";

  // 3. Clonar la petición añadiendo el token (si no hay token, enviamos la original)
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq).pipe(
    catchError((error) => {
      // 4. Si el error es 401 y NO es una petición de login/refresh
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
        const authService = injector.get(AuthService);
        console.warn('Token expirado o inválido. Intentando refrescar token...');
        return authService.refreshToken().pipe(
          switchMap((res) => {
            // Reintentar la petición original con el nuevo token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.accessToken}` }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Si el refresh falla, limpiamos y fuera
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};