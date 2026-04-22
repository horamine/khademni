import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss'
})
export class CreateProjectComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(false);
  readonly isEdit = signal(false);
  readonly projectId = signal<number | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    budget: [null as number | null, [Validators.required, Validators.min(1)]],
    deadline: [null as string | null],
    requiredSkills: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.projectId.set(Number(id));
      this.projectService.getById(Number(id)).subscribe({
        next: (project) => {
          this.form.patchValue({
            title: project.title,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline ?? null,
            requiredSkills: project.requiredSkills?.join(', ') ?? ''
          });
        },
        error: () => {
          this.toastr.success('Projet introuvable.');
          this.router.navigate(['/client/projects']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const project = {
      title: raw.title!,
      description: raw.description!,
      budget: raw.budget!,
      deadline: raw.deadline ? raw.deadline : undefined,
      requiredSkills: this.parseSkills(raw.requiredSkills ?? '')
    };

    const request$ = this.isEdit()
      ? this.projectService.update(this.projectId()!, project)
      : this.projectService.create(project);

    request$.subscribe({
      next: (saved) => {
        this.loading.set(false);
        const msg = this.isEdit() ? 'Projet mis à jour !' : 'Projet créé avec succès !';
        this.toastr.success(msg);
        this.router.navigate(['/client/projects', saved.id]);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Erreur. Veuillez réessayer.');
      }
    });
  }

  private parseSkills(skillsString: string): string[] {
    return skillsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }
}
