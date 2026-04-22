import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly Role = Role;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [Role.FREELANCER, Validators.required]
  });

  readonly passwordStrength = computed(() => {
    const pw = this.form.get('password')?.value ?? '';
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  });

  readonly strengthLabel = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return 'AUTH.STRENGTH_WEAK';
    if (s === 2) return 'AUTH.STRENGTH_FAIR';
    if (s === 3) return 'AUTH.STRENGTH_GOOD';
    return 'AUTH.STRENGTH_STRONG';
  });

  readonly strengthColor = computed(() => {
    const s = this.passwordStrength();
    if (s <= 1) return '#E74C3C';
    if (s === 2) return '#FDCB6E';
    if (s === 3) return '#00B894';
    return '#00B894';
  });

  get selectedRole(): Role {
    return this.form.get('role')?.value as Role ?? Role.FREELANCER;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { name, email, password, role } = this.form.getRawValue();
    this.authService.register({ name: name!, email: email!, password: password!, role: role! }).subscribe({
      next: (authResponse) => {
        this.loading.set(false);
        this.toastr.success('Compte créé ! Bienvenue sur Khademni 🎉');
        this.authService.setAuth(authResponse);
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.error ?? "Échec de l'inscription. Réessayez.";
        this.toastr.error(typeof msg === 'string' ? msg : "Échec de l'inscription.");
      }
    });
  }
}

