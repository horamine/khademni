import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-client-project-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ClientProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly applicationService = inject(ApplicationService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly project = signal<Project | null>(null);
  readonly applications = signal<Application[]>([]);
  readonly processingId = signal<number | null>(null);

  readonly ApplicationStatus = ApplicationStatus;
  readonly ProjectStatus = ProjectStatus;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loadApplications(id);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Projet introuvable.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/client/projects']);
      }
    });
  }

  loadApplications(projectId: number): void {
    this.applicationService.getByProject(projectId).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  acceptApplication(app: Application): void {
    if (!confirm(`Accepter cette candidature ? Le projet passera en "En cours".`)) return;
    this.processingId.set(app.id!);
    this.applicationService.accept(app.id!).subscribe({
      next: () => {
        this.applications.update(apps => apps.map(a => a.id === app.id ? { ...a, status: ApplicationStatus.ACCEPTED } : a));
        this.processingId.set(null);
        this.snackBar.open('Candidature acceptée !', 'Fermer', { duration: 3000 });
        // Update project status to IN_PROGRESS
        this.projectService.updateStatus(this.project()!.id!, ProjectStatus.IN_PROGRESS).subscribe({
          next: (updated) => this.project.set(updated)
        });
      },
      error: () => {
        this.processingId.set(null);
        this.snackBar.open('Erreur lors de l\'acceptation.', 'Fermer', { duration: 4000 });
      }
    });
  }

  rejectApplication(app: Application): void {
    if (!confirm(`Rejeter cette candidature ?`)) return;
    this.processingId.set(app.id!);
    this.applicationService.reject(app.id!).subscribe({
      next: () => {
        this.applications.update(apps => apps.map(a => a.id === app.id ? { ...a, status: ApplicationStatus.REJECTED } : a));
        this.processingId.set(null);
        this.snackBar.open('Candidature rejetée.', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.processingId.set(null);
        this.snackBar.open('Erreur lors du rejet.', 'Fermer', { duration: 4000 });
      }
    });
  }

  deleteProject(): void {
    if (!confirm(`Supprimer le projet "${this.project()?.title}" ? Cette action est irréversible.`)) return;
    this.projectService.delete(this.project()!.id!).subscribe({
      next: () => {
        this.snackBar.open('Projet supprimé.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/client/projects']);
      },
      error: () => this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 4000 })
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'OPEN': return '#00B894';
      case 'IN_PROGRESS': return '#FF6B35';
      case 'CLOSED': case 'COMPLETED': return '#636E72';
      case 'CANCELLED': return '#E74C3C';
      case 'PENDING': return '#FDCB6E';
      case 'ACCEPTED': return '#00B894';
      case 'REJECTED': return '#E74C3C';
      default: return '#636E72';
    }
  }

  pendingApplications(): Application[] {
    return this.applications().filter(a => a.status === ApplicationStatus.PENDING);
  }
}
