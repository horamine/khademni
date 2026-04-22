import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class FreelancerDashboardComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly applications = signal<Application[]>([]);

  get totalApplications(): number { return this.applications().length; }
  get acceptedApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.ACCEPTED).length; }
  get pendingApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.PENDING).length; }
  get rejectedApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.REJECTED).length; }

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.applicationService.getByFreelancer(userId).subscribe({
        next: (apps) => {
          this.applications.set(apps);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
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
