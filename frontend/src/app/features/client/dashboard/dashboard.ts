import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule, BaseChartDirective],
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

  // Line chart — projects over time (mock months)
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{
      data: [1, 2, 2, 3, 4, 5],
      label: 'Projets',
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255,107,53,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#FF6B35',
    }]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  // Donut chart — applications by status
  donutChartData: ChartData<'doughnut'> = {
    labels: ['Ouvert', 'En cours', 'Terminé'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#00B894', '#FF6B35', '#636E72'], borderWidth: 0 }]
  };
  donutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    cutout: '65%'
  };

  ngOnInit(): void {
    this.projectService.getMyProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.recentProjects.set(projects.slice(0, 5));
        this.updateCharts(projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private updateCharts(projects: Project[]): void {
    const open = projects.filter(p => p.status === ProjectStatus.OPEN).length;
    const inProgress = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
    const done = projects.filter(p => p.status === ProjectStatus.CLOSED || p.status === ProjectStatus.COMPLETED).length;
    this.donutChartData = {
      ...this.donutChartData,
      datasets: [{ ...this.donutChartData.datasets[0], data: [open || 0, inProgress || 0, done || 0] }]
    };
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

