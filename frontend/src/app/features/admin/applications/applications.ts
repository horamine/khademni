import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './applications.html',
  styleUrl: './applications.scss'
})
export class AdminApplicationsComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);

  readonly loading = signal(true);
  readonly applications = signal<Application[]>([]);
  readonly filtered = signal<Application[]>([]);

  statusFilter = '';
  readonly statuses = ['', 'PENDING', 'ACCEPTED', 'REJECTED'];
  displayedColumns = ['id', 'projectId', 'freelancerId', 'status', 'appliedAt'];

  readonly ApplicationStatus = ApplicationStatus;

  ngOnInit(): void {
    this.applicationService.getAllAdmin().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.filtered.set(apps);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.applications();
    if (this.statusFilter) {
      result = result.filter(a => a.status === this.statusFilter);
    }
    this.filtered.set(result);
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
