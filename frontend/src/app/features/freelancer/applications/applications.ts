import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-freelancer-applications',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatTableModule, MatTabsModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './applications.html',
  styleUrl: './applications.scss'
})
export class FreelancerApplicationsComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly applications = signal<Application[]>([]);

  readonly ApplicationStatus = ApplicationStatus;

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.applicationService.getByFreelancer(userId).subscribe({
        next: (apps) => {
          this.applications.set(apps.sort((a, b) =>
            (b.appliedAt ?? '').localeCompare(a.appliedAt ?? '')
          ));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  getByStatus(status: ApplicationStatus | null): Application[] {
    if (!status) return this.applications();
    return this.applications().filter(a => a.status === status);
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'PENDING': return '#FDCB6E';
      case 'ACCEPTED': return '#00B894';
      case 'REJECTED': return '#E74C3C';
      default: return '#636E72';
    }
  }
}
