import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { Application } from '../../../core/models/application.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class ClientDashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly recentProjects = signal<Project[]>([]);

  get totalProjects(): number { return this.projects().length; }
  get openProjects(): number { return this.projects().filter(p => p.status === ProjectStatus.OPEN).length; }
  get inProgressProjects(): number { return this.projects().filter(p => p.status === ProjectStatus.IN_PROGRESS).length; }
  get closedProjects(): number { return this.projects().filter(p => p.status === ProjectStatus.CLOSED || p.status === ProjectStatus.COMPLETED).length; }

  ngOnInit(): void {
    this.projectService.getMyProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.recentProjects.set(projects.slice(0, 5));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'OPEN': return '#00B894';
      case 'IN_PROGRESS': return '#FF6B35';
      case 'CLOSED': case 'COMPLETED': return '#636E72';
      default: return '#636E72';
    }
  }
}
