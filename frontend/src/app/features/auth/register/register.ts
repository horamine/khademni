import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);
  readonly Role = Role;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [Role.FREELANCER, Validators.required]
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
        this.snackBar.open('Account created! Welcome to Khademni 🎉', 'Close', { duration: 3000 });
        this.authService.setAuth(authResponse);
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.error ?? 'Registration failed. Please try again.';
        this.snackBar.open(typeof msg === 'string' ? msg : 'Registration failed.', 'Close', { duration: 4000 });
      }
    });
  }
}
