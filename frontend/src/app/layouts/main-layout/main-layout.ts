import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatSidenavModule, MatListModule, MatDividerModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  protected readonly authService = inject(AuthService);
  readonly Role = Role;
  readonly sidenavOpen = signal(false);

  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    return this.authService.getDashboardRoute();
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }

  get clientNavItems() {
    return [
      { label: 'Tableau de bord', icon: 'dashboard', route: '/client/dashboard' },
      { label: 'Mes projets', icon: 'folder', route: '/client/projects' },
      { label: 'Nouveau projet', icon: 'add_circle', route: '/client/create-project' },
      { label: 'Freelancers', icon: 'people', route: '/client/freelancers' },
    ];
  }

  get freelancerNavItems() {
    return [
      { label: 'Tableau de bord', icon: 'dashboard', route: '/freelancer/dashboard' },
      { label: 'Parcourir projets', icon: 'work', route: '/freelancer/projects' },
      { label: 'Mes candidatures', icon: 'list_alt', route: '/freelancer/applications' },
      { label: 'Mon profil', icon: 'person', route: '/freelancer/profile' },
    ];
  }

  get adminNavItems() {
    return [
      { label: 'Tableau de bord', icon: 'dashboard', route: '/admin/dashboard' },
      { label: 'Utilisateurs', icon: 'manage_accounts', route: '/admin/users' },
    ];
  }

  get currentNavItems() {
    const role = this.authService.role();
    if (role === Role.CLIENT) return this.clientNavItems;
    if (role === Role.FREELANCER) return this.freelancerNavItems;
    if (role === Role.ADMIN) return this.adminNavItems;
    return [];
  }
}
