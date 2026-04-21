import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-client-freelancers',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <h1>Browse Freelancers</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Freelancer Directory</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 Freelancer browsing coming soon. You'll be able to filter by skills and contact freelancers directly.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class ClientFreelancersComponent {}
