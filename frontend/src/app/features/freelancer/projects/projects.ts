import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-freelancer-projects',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  template: `
    <h1>Browse Projects</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Available Projects</mat-card-title>
        <mat-card-subtitle>Find projects that match your skills</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 Project listing coming soon. You'll see open projects here and be able to apply.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class FreelancerProjectsComponent {}
