import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-freelancer-applications',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  template: `
    <h1>My Applications</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Application History</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 Application tracking coming soon. You'll see the status of all your project applications here.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class FreelancerApplicationsComponent {}
