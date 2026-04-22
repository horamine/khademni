import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-projects',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <h1>My Projects</h1>
    <mat-card>
      <mat-card-header>
        <mat-card-title>Project List</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>🚧 Your projects will appear here.</p>
      </mat-card-content>
      <mat-card-actions>
        <a mat-raised-button color="primary" routerLink="/client/create-project">+ New Project</a>
      </mat-card-actions>
    </mat-card>
  `
})
export class ClientProjectsComponent {}
