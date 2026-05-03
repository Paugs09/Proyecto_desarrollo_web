import { computed, Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  // Estado privado: Intentamos recuperar el objeto completo
  private readonly _user = signal<any | null>(this.getUserFromStorage());

  // Público readonly
  readonly user = this._user.asReadonly();

  // Computed: Reacciona automáticamente
    readonly isAdmin = computed(() => {
      const u = this.user();
      return !!u?.isAdmin || u?.roleId === 1 || u?.role === 'admin';
    });

  private readonly logoutSubject = new Subject<void>();
  readonly logout$ = this.logoutSubject.asObservable();

  private getUserFromStorage(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = sessionStorage.getItem('user_data');
      return userJson ? JSON.parse(userJson) : null;
    }

    return null;
  }

  login(credentials: object): Observable<any> {
    this.logout();
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(credentials: object): Observable<any> {
    this.logout();
    return this.http.post<any>(`${this.apiUrl}/register`, credentials).pipe(
    );
  }

  //foto
  uploadAvatar(file: File): Observable<string> {
  const formData = new FormData();
  
  formData.append('FormFile', file); 

  return this.http.post(`${this.apiUrl}/upload-avatar`, formData, { 
    responseType: 'text' 
  });
}

  refreshToken(): Observable<any> {
    const body = {
      accessToken: sessionStorage.getItem('token'),
      refreshToken: sessionStorage.getItem('refreshToken')
    };

    return this.http.post<any>(`${this.apiUrl}/refresh`, body).pipe(
      tap(res => this.setSession(res)),
      catchError(err => {
        // Si el refresh falla (ej. token ya usado o expirado)
        this.logout(); // Limpiamos Signals y Storage
        return throwError(() => err);
      })
    );
  }

  // Centralizamos el guardado para evitar errores de consistencia
  private setSession(authData: any) {
    sessionStorage.setItem('token', authData.accessToken);
    sessionStorage.setItem('refreshToken', authData.refreshToken);
    // Guardamos el objeto completo para tener isAdmin y otros datos al recargar
    sessionStorage.setItem('user_data', JSON.stringify(authData));

    this._user.set(authData);
  }

  logout() {
    sessionStorage.clear();
    this._user.set(null);
    this.logoutSubject.next();
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user-info`).pipe(
      tap(userData => {
        const datosActuales = this._user();
        const datosCompletos = {
          ...userData,
          isAdmin: userData.isAdmin
            ?? datosActuales?.isAdmin
            ?? (userData.roleId === 1 || userData.role === 'admin')
        };
        sessionStorage.setItem('user_data', JSON.stringify(datosCompletos));
        this._user.set(datosCompletos);
      })
    );
  }

  //editar info de usuario
  updateUser(data: object): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user-update`, data).pipe(
      tap(() => this.getUserInfo().subscribe())
    );
  }
}
