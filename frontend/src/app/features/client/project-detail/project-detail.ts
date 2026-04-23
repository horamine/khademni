import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { ContractService } from '../../../core/services/contract.service';
import { MatchService } from '../../../core/services/match.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { RecommendedFreelancer } from '../../../core/models/match.model';
import { CreateContractDialogComponent } from './create-contract-dialog';
import { MatchScoreBadgeComponent } from '../../../shared/components/match-score-badge/match-score-badge';

@Component({
  selector: 'app-client-project-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatDividerModule, MatDialogModule, TranslateModule,
    MatchScoreBadgeComponent
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ClientProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly applicationService = inject(ApplicationService);
  private readonly contractService = inject(ContractService);
  private readonly matchService = inject(MatchService);
  private readonly toastr = inject(ToastrService);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(true);
  readonly project = signal<Project | null>(null);
  readonly applications = signal<Application[]>([]);
  readonly processingId = signal<number | null>(null);
  readonly recommendedFreelancers = signal<RecommendedFreelancer[]>([]);

  readonly ApplicationStatus = ApplicationStatus;
  readonly ProjectStatus = ProjectStatus;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getById(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loadApplications(id);
        this.loadRecommendedFreelancers(id);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Projet introuvable.');
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

  private loadRecommendedFreelancers(projectId: number): void {
    this.matchService.getRecommendedFreelancers(projectId, 5).subscribe({
      next: (recs) => this.recommendedFreelancers.set(recs),
      error: () => {}
    });
  }

  acceptApplication(app: Application): void {
    if (!confirm(`Accepter cette candidature ? Le projet passera en "En cours".`)) return;
    this.processingId.set(app.id!);
    this.applicationService.accept(app.id!).subscribe({
      next: () => {
        this.applications.update(apps => apps.map(a => a.id === app.id ? { ...a, status: ApplicationStatus.ACCEPTED } : a));
        this.processingId.set(null);
        this.toastr.success('Candidature acceptée !');
        this.projectService.updateStatus(this.project()!.id!, ProjectStatus.IN_PROGRESS).subscribe({
          next: (updated) => this.project.set(updated)
        });
      },
      error: () => {
        this.processingId.set(null);
        this.toastr.error('Erreur lors de l\'acceptation.');
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
        this.toastr.info('Candidature rejetée.');
      },
      error: () => {
        this.processingId.set(null);
        this.toastr.error('Erreur lors du rejet.');
      }
    });
  }

  openCreateContractDialog(app: Application): void {
    const ref = this.dialog.open(CreateContractDialogComponent, {
      width: '480px',
      data: { application: app, project: this.project() }
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.contractService.create({
          applicationId: app.id!,
          startDate: result.startDate,
          endDate: result.endDate,
          payment: result.payment
        }).subscribe({
          next: () => this.toastr.success('Contrat créé !'),
          error: (err) => this.toastr.error(err?.error?.message || 'Erreur lors de la création du contrat.')
        });
      }
    });
  }

  deleteProject(): void {
    if (!confirm(`Supprimer le projet "${this.project()?.title}" ? Cette action est irréversible.`)) return;
    this.projectService.delete(this.project()!.id!).subscribe({
      next: () => {
        this.toastr.success('Projet supprimé.');
        this.router.navigate(['/client/projects']);
      },
      error: () => this.toastr.error('Erreur lors de la suppression.')
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

