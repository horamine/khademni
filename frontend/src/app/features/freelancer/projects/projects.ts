import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project } from '../../../core/models/project.model';
import { Application } from '../../../core/models/application.model';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule as MatInput } from '@angular/material/input';

@Component({
  selector: 'app-freelancer-projects',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class FreelancerProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly filtered = signal<Project[]>([]);
  readonly applyingTo = signal<number | null>(null);
  readonly appliedIds = signal<Set<number>>(new Set());

  searchTerm = '';

  applyForm = this.fb.group({
    coverLetter: ['', [Validators.required, Validators.minLength(20)]],
    proposedBudget: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  activeApplyProjectId = signal<number | null>(null);

  ngOnInit(): void {
    this.projectService.getOpen().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.filtered.set(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    const q = this.searchTerm.toLowerCase();
    if (!q.trim()) {
      this.filtered.set(this.projects());
      return;
    }
    this.filtered.set(this.projects().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.requiredSkills?.some(s => s.toLowerCase().includes(q))
    ));
  }

  showApplyForm(projectId: number): void {
    this.activeApplyProjectId.set(projectId);
    this.applyForm.reset();
  }

  cancelApply(): void {
    this.activeApplyProjectId.set(null);
    this.applyForm.reset();
  }

  submitApplication(project: Project): void {
    if (this.applyForm.invalid) return;
    const freelancerId = this.authService.userId();
    if (!freelancerId) return;

    this.applyingTo.set(project.id!);
    const raw = this.applyForm.getRawValue();
    this.applicationService.apply({
      projectId: project.id!,
      freelancerId,
      coverLetter: raw.coverLetter!,
      proposedBudget: raw.proposedBudget!
    }).subscribe({
      next: () => {
        this.applyingTo.set(null);
        this.activeApplyProjectId.set(null);
        this.appliedIds.update(ids => new Set([...ids, project.id!]));
        this.toastr.success('Candidature envoyée avec succès !');
      },
      error: () => {
        this.applyingTo.set(null);
        this.toastr.error('Erreur lors de l\'envoi de la candidature.');
      }
    });
  }
}
