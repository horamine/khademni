import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule, TranslateModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class AdminProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(true);
  readonly deletingId = signal<number | null>(null);
  readonly projects = signal<Project[]>([]);
  readonly filtered = signal<Project[]>([]);

  searchTerm = '';
  statusFilter = '';
  readonly statuses = ['', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'];
  displayedColumns = ['id', 'title', 'clientId', 'status', 'budget', 'createdAt', 'actions'];

  readonly ProjectStatus = ProjectStatus;

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.filtered.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.projects();
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }
    this.filtered.set(result);
  }

  deleteProject(project: Project): void {
    if (!confirm(`${project.title} ?`)) return;
    this.deletingId.set(project.id!);
    this.projectService.delete(project.id!).subscribe({
      next: () => {
        this.projects.update(ps => ps.filter(p => p.id !== project.id));
        this.applyFilters();
        this.deletingId.set(null);
        this.toastr.success('Projet supprimé.');
      },
      error: () => {
        this.deletingId.set(null);
        this.toastr.error('Erreur lors de la suppression.');
      }
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'OPEN': return '#00B894';
      case 'IN_PROGRESS': return '#FF6B35';
      case 'COMPLETED': case 'CLOSED': return '#636E72';
      case 'CANCELLED': return '#E74C3C';
      default: return '#636E72';
    }
  }
}
