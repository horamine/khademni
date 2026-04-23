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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { Role } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatSidenavModule, MatListModule, MatDividerModule, MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  readonly Role = Role;
  readonly sidenavOpen = signal(true);
  readonly sidenavCollapsed = signal(false);

  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    return this.authService.getDashboardRoute();
  }

  toggleSidenav(): void {
    if (this.authService.isAuthenticated()) {
      this.sidenavCollapsed.update(v => !v);
    }
  }

  get clientNavItems() {
    return [
      { labelKey: 'SIDEBAR.DASHBOARD', icon: 'dashboard', route: '/client/dashboard' },
      { labelKey: 'SIDEBAR.MY_PROJECTS', icon: 'folder', route: '/client/projects' },
      { labelKey: 'SIDEBAR.NEW_PROJECT', icon: 'add_circle', route: '/client/create-project' },
      { labelKey: 'SIDEBAR.FREELANCERS', icon: 'people', route: '/client/freelancers' },
    ];
  }

  get freelancerNavItems() {
    return [
      { labelKey: 'SIDEBAR.DASHBOARD', icon: 'dashboard', route: '/freelancer/dashboard' },
      { labelKey: 'SIDEBAR.BROWSE_PROJECTS', icon: 'work', route: '/freelancer/projects' },
      { labelKey: 'SIDEBAR.MY_APPLICATIONS', icon: 'list_alt', route: '/freelancer/applications' },
      { labelKey: 'SIDEBAR.MY_PROFILE', icon: 'person', route: '/freelancer/profile' },
    ];
  }

  get adminNavItems() {
    return [
      { labelKey: 'SIDEBAR.DASHBOARD', icon: 'dashboard', route: '/admin/dashboard' },
      { labelKey: 'SIDEBAR.USERS', icon: 'manage_accounts', route: '/admin/users' },
      { labelKey: 'SIDEBAR.PROJECTS', icon: 'folder', route: '/admin/projects' },
      { labelKey: 'SIDEBAR.APPLICATIONS', icon: 'list_alt', route: '/admin/applications' },
      { labelKey: 'SIDEBAR.CONTRACTS', icon: 'description', route: '/admin/contracts' },
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

