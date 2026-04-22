import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class FreelancerDashboardComponent implements OnInit {
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly applications = signal<Application[]>([]);

  get totalApplications(): number { return this.applications().length; }
  get acceptedApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.ACCEPTED).length; }
  get pendingApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.PENDING).length; }
  get rejectedApplications(): number { return this.applications().filter(a => a.status === ApplicationStatus.REJECTED).length; }

  // Line chart — applications over time
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [{
      data: [0, 1, 1, 2, 3, 4],
      label: 'Candidatures',
      borderColor: '#004E89',
      backgroundColor: 'rgba(0,78,137,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#004E89',
    }]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  // Bar chart — success rate vs peers (mock)
  barChartData: ChartData<'bar'> = {
    labels: ['Toi', 'Pair 1', 'Pair 2', 'Pair 3', 'Pair 4'],
    datasets: [{ data: [0, 45, 38, 52, 41], label: '% Accepté', backgroundColor: ['#FF6B35', '#004E8980', '#004E8980', '#004E8980', '#004E8980'] }]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100 } }
  };

  ngOnInit(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.applicationService.getByFreelancer(userId).subscribe({
        next: (apps) => {
          this.applications.set(apps);
          this.updateCharts(apps);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  private updateCharts(apps: Application[]): void {
    const total = apps.length;
    const accepted = apps.filter(a => a.status === ApplicationStatus.ACCEPTED).length;
    const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    this.barChartData = {
      ...this.barChartData,
      datasets: [{ ...this.barChartData.datasets[0], data: [rate, 45, 38, 52, 41] }]
    };
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

