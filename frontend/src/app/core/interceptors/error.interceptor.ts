import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        snackBar.open('Session expirée. Veuillez vous reconnecter.', 'Fermer', { duration: 4000 });
      } else if (error.status === 403) {
        snackBar.open('Accès refusé.', 'Fermer', { duration: 4000 });
        router.navigate(['/']);
      } else if (error.status >= 500) {
        snackBar.open('Erreur serveur. Veuillez réessayer.', 'Fermer', { duration: 4000 });
      }
      return throwError(() => error);
    })
  );
};
