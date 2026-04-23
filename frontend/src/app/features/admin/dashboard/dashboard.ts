import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';
import { ContractService } from '../../../core/services/contract.service';
import { User, Role } from '../../../core/models/user.model';
import { Project, ProjectStatus } from '../../../core/models/project.model';
import { Contract, ContractStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly projectService = inject(ProjectService);
  private readonly contractService = inject(ContractService);

  readonly loading = signal(true);
  readonly users = signal<User[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly contracts = signal<Contract[]>([]);

  get totalUsers(): number { return this.users().length; }
  get totalFreelancers(): number { return this.users().filter(u => u.role === Role.FREELANCER).length; }
  get totalClients(): number { return this.users().filter(u => u.role === Role.CLIENT).length; }
  get totalProjects(): number { return this.projects().length; }
  get openProjects(): number { return this.projects().filter(p => p.status === ProjectStatus.OPEN).length; }
  get totalContracts(): number { return this.contracts().length; }
  get activeContracts(): number { return this.contracts().filter(c => c.status === ContractStatus.ACTIVE).length; }
  get completedContracts(): number { return this.contracts().filter(c => c.status === ContractStatus.COMPLETED).length; }

  // Bar chart — users by role
  usersBarData: ChartData<'bar'> = {
    labels: ['Freelancers', 'Clients', 'Admins'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#004E89', '#FF6B35', '#00B894'], borderWidth: 0 }]
  };
  usersBarOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  // Line chart — platform growth (mock)
  growthLineData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [2, 5, 8, 12, 18, 25],
        label: 'Utilisateurs',
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255,107,53,0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [1, 3, 5, 7, 11, 15],
        label: 'Projets',
        borderColor: '#004E89',
        backgroundColor: 'rgba(0,78,137,0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
  growthLineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
    scales: { y: { beginAtZero: true } }
  };

  // Donut — projects by status
  projectsDonutData: ChartData<'doughnut'> = {
    labels: ['Ouvert', 'En cours', 'Terminé'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#00B894', '#FF6B35', '#636E72'], borderWidth: 0 }]
  };
  projectsDonutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    cutout: '65%'
  };

  // Donut — contracts by status
  contractsDonutData: ChartData<'doughnut'> = {
    labels: ['Actif', 'Terminé', 'Annulé'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#004E89', '#00B894', '#E74C3C'], borderWidth: 0 }]
  };
  contractsDonutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    cutout: '65%'
  };

  ngOnInit(): void {
    let loaded = 0;
    const done = () => { if (++loaded === 3) this.loading.set(false); };

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        const fl = users.filter(u => u.role === Role.FREELANCER).length;
        const cl = users.filter(u => u.role === Role.CLIENT).length;
        const ad = users.filter(u => u.role === Role.ADMIN).length;
        this.usersBarData = {
          ...this.usersBarData,
          datasets: [{ ...this.usersBarData.datasets[0], data: [fl, cl, ad] }]
        };
        done();
      },
      error: done
    });

    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        const open = projects.filter(p => p.status === ProjectStatus.OPEN).length;
        const inProg = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
        const done2 = projects.filter(p => p.status === ProjectStatus.CLOSED || p.status === ProjectStatus.COMPLETED).length;
        this.projectsDonutData = {
          ...this.projectsDonutData,
          datasets: [{ ...this.projectsDonutData.datasets[0], data: [open, inProg, done2] }]
        };
        done();
      },
      error: done
    });

    this.contractService.getAll().subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        const active = contracts.filter(c => c.status === ContractStatus.ACTIVE).length;
        const completed = contracts.filter(c => c.status === ContractStatus.COMPLETED).length;
        const cancelled = contracts.filter(c => c.status === ContractStatus.CANCELLED).length;
        this.contractsDonutData = {
          ...this.contractsDonutData,
          datasets: [{ ...this.contractsDonutData.datasets[0], data: [active, completed, cancelled] }]
        };
        done();
      },
      error: done
    });
  }
}

