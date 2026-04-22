import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        toastr.warning('Session expirée. Veuillez vous reconnecter.', '', { timeOut: 4000 });
      } else if (error.status === 403) {
        toastr.error('Accès refusé.', '', { timeOut: 4000 });
        router.navigate(['/']);
      } else if (error.status >= 500) {
        toastr.error('Erreur serveur. Veuillez réessayer.', '', { timeOut: 4000 });
      }
      return throwError(() => error);
    })
  );
};

