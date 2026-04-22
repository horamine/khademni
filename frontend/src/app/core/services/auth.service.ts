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

  login(request: LoginRequest): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/api/auth/login`, request, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          const payload = this.decodeJwt(token);
          const authResponse: AuthResponse = {
            token,
            role: payload['role'] as Role,
            email: payload['sub'] as string,
            name: (payload['name'] as string) ?? (payload['sub'] as string),
          };
          this.saveToStorage(authResponse);
          this._currentUser.set(authResponse);
        })
      );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem('auth');
    this._currentUser.set(null);
    this.router.navigate(['/login']);
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

  private decodeJwt(token: string): Record<string, unknown> {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return {};
    }
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
