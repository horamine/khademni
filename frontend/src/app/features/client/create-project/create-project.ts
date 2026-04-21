import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss'
})
export class CreateProjectComponent {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    budget: [null as number | null, [Validators.required, Validators.min(1)]],
    requiredSkills: ['']
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const project = {
      title: raw.title!,
      description: raw.description!,
      budget: raw.budget!,
      requiredSkills: raw.requiredSkills ? raw.requiredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
    };
    this.projectService.create(project).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Project created!', 'Close', { duration: 3000 });
        this.router.navigate(['/client/projects']);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to create project. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }
}
