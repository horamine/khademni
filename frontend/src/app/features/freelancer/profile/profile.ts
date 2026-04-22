import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <h1>My Profile</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Profile Information</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 Profile editing coming soon. You'll be able to update your skills, experience, and availability.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" disabled>Edit Profile</button>
      </mat-card-actions>
    </mat-card>
  `
})
export class FreelancerProfileComponent {}
