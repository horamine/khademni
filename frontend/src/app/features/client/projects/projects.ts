import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ClientProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(true);
  readonly deleting = signal<number | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly filteredProjects = signal<Project[]>([]);

  searchTerm = '';
  statusFilter = '';
  readonly ProjectStatus = ProjectStatus;
  readonly statuses = ['', 'OPEN', 'IN_PROGRESS', 'CLOSED', 'COMPLETED', 'CANCELLED'];

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.projectService.getMyProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.projects();
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }
    this.filteredProjects.set(result);
  }

  deleteProject(project: Project): void {
    if (!confirm(`Supprimer le projet "${project.title}" ?`)) return;
    this.deleting.set(project.id!);
    this.projectService.delete(project.id!).subscribe({
      next: () => {
        this.projects.update(ps => ps.filter(p => p.id !== project.id));
        this.applyFilters();
        this.deleting.set(null);
        this.toastr.success('Projet supprimé.');
      },
      error: () => {
        this.deleting.set(null);
        this.toastr.error('Erreur lors de la suppression.');
      }
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'OPEN': return '#00B894';
      case 'IN_PROGRESS': return '#FF6B35';
      case 'CLOSED': case 'COMPLETED': return '#636E72';
      case 'CANCELLED': return '#E74C3C';
      default: return '#636E72';
    }
  }
}
