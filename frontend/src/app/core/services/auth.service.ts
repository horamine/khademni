import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, Role, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly _currentUser = signal<AuthResponse | null>(this.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed(() => this._currentUser()?.role ?? null);
  readonly userId = computed(() => this._currentUser()?.userId ?? null);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/auth/login`, request)
      .pipe(
        tap((authResponse: AuthResponse) => {
          this.saveToStorage(authResponse);
          this._currentUser.set(authResponse);
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem('auth');
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  setAuth(auth: AuthResponse): void {
    this.saveToStorage(auth);
    this._currentUser.set(auth);
  }

  getToken(): string | null {
    return this._currentUser()?.token ?? null;
  }

  getDashboardRoute(): string {
    const r = this.role();
    if (r === Role.FREELANCER) return '/freelancer/dashboard';
    if (r === Role.CLIENT) return '/client/dashboard';
    if (r === Role.ADMIN) return '/admin/dashboard';
    return '/';
  }

  private saveToStorage(auth: AuthResponse): void {
    localStorage.setItem('auth', JSON.stringify(auth));
  }

  private loadFromStorage(): AuthResponse | null {
    try {
      const stored = localStorage.getItem('auth');
      return stored ? (JSON.parse(stored) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
