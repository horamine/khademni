import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  template: `
    <h1>User Management</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>All Users</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 User management coming soon. View, edit, and deactivate platform users.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class AdminUsersComponent {}
