import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { User } from '../../../core/models/user.model';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly projectService = inject(ProjectService);

  readonly loading = signal(true);
  readonly users = signal<User[]>([]);
  readonly projects = signal<Project[]>([]);

  get totalUsers(): number { return this.users().length; }
  get totalFreelancers(): number { return this.users().filter(u => u.role === 'FREELANCER' as any).length; }
  get totalClients(): number { return this.users().filter(u => u.role === 'CLIENT' as any).length; }
  get totalProjects(): number { return this.projects().length; }
  get openProjects(): number { return this.projects().filter(p => p.status === 'OPEN' as any).length; }

  ngOnInit(): void {
    let loaded = 0;
    const done = () => { if (++loaded === 2) this.loading.set(false); };

    this.userService.getAllUsers().subscribe({
      next: (users) => { this.users.set(users); done(); },
      error: done
    });

    this.projectService.getAll().subscribe({
      next: (projects) => { this.projects.set(projects); done(); },
      error: done
    });
  }
}
