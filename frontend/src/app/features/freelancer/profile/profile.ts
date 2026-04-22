import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Freelancer } from '../../../core/models/user.model';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class FreelancerProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly freelancer = signal<Freelancer | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    skills: [''],
    experienceYears: [0, [Validators.min(0)]],
    availability: [0, [Validators.min(0)]]
  });

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.userService.getFreelancerById(userId).subscribe({
        next: (freelancer) => {
          this.freelancer.set(freelancer);
          this.form.patchValue({
            name: freelancer.name,
            skills: freelancer.skills?.join(', ') ?? '',
            experienceYears: freelancer.experienceYears ?? 0,
            availability: freelancer.availability ?? 0
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  onSave(): void {
    if (this.form.invalid) return;
    const userId = this.authService.userId();
    if (!userId) return;

    this.saving.set(true);
    const raw = this.form.getRawValue();
    const update = {
      name: raw.name!,
      skills: raw.skills ? raw.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
      experienceYears: raw.experienceYears ?? 0,
      availability: raw.availability ?? 0
    };

    this.userService.updateFreelancer(userId, update).subscribe({
      next: (updated) => {
        this.freelancer.set(updated);
        this.saving.set(false);
        this.toastr.success('Profil mis à jour !');
      },
      error: () => {
        this.saving.set(false);
        this.toastr.error('Erreur lors de la sauvegarde.');
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').filter(w => w.length > 0).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
