import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home').then((m) => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent)
      },
      // Freelancer routes
      {
        path: 'freelancer',
        canActivate: [authGuard, roleGuard([Role.FREELANCER])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/freelancer/dashboard/dashboard').then((m) => m.FreelancerDashboardComponent)
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/freelancer/profile/profile').then((m) => m.FreelancerProfileComponent)
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./features/freelancer/projects/projects').then((m) => m.FreelancerProjectsComponent)
          },
          {
            path: 'applications',
            loadComponent: () =>
              import('./features/freelancer/applications/applications').then((m) => m.FreelancerApplicationsComponent)
          },
          {
            path: 'contracts',
            loadComponent: () =>
              import('./features/freelancer/contracts/contracts').then((m) => m.FreelancerContractsComponent)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      // Client routes
      {
        path: 'client',
        canActivate: [authGuard, roleGuard([Role.CLIENT])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/client/dashboard/dashboard').then((m) => m.ClientDashboardComponent)
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./features/client/projects/projects').then((m) => m.ClientProjectsComponent)
          },
          {
            path: 'projects/new',
            loadComponent: () =>
              import('./features/client/create-project/create-project').then((m) => m.CreateProjectComponent)
          },
          {
            path: 'projects/:id/edit',
            loadComponent: () =>
              import('./features/client/create-project/create-project').then((m) => m.CreateProjectComponent)
          },
          {
            path: 'projects/:id',
            loadComponent: () =>
              import('./features/client/project-detail/project-detail').then((m) => m.ClientProjectDetailComponent)
          },
          {
            path: 'create-project',
            loadComponent: () =>
              import('./features/client/create-project/create-project').then((m) => m.CreateProjectComponent)
          },
          {
            path: 'freelancers',
            loadComponent: () =>
              import('./features/client/freelancers/freelancers').then((m) => m.ClientFreelancersComponent)
          },
          {
            path: 'contracts',
            loadComponent: () =>
              import('./features/client/contracts/contracts').then((m) => m.ClientContractsComponent)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      // Admin routes
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard([Role.ADMIN])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent)
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/users/users').then((m) => m.AdminUsersComponent)
          },
          {
            path: 'projects',
            loadComponent: () =>
              import('./features/admin/projects/projects').then((m) => m.AdminProjectsComponent)
          },
          {
            path: 'applications',
            loadComponent: () =>
              import('./features/admin/applications/applications').then((m) => m.AdminApplicationsComponent)
          },
          {
            path: 'contracts',
            loadComponent: () =>
              import('./features/admin/contracts/contracts').then((m) => m.AdminContractsComponent)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
