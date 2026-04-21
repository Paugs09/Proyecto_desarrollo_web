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
  //private readonly router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Estado privado: Intentamos recuperar el objeto completo
  private readonly _user = signal<any | null>(this.getUserFromStorage());

  // Público readonly
  readonly user = this._user.asReadonly();

  // Computed: Reacciona automáticamente
  readonly isAdmin = computed(() => !!this.user()?.isAdmin);

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
      sessionStorage.setItem('user_data', JSON.stringify(userData));
      this._user.set(userData);
    })
  );
}
}
