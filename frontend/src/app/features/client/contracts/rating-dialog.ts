import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { Contract } from '../../../core/models/application.model';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    TranslateModule, RatingStarsComponent
  ],
  template: `
    <h2 mat-dialog-title>{{ 'CLIENT.CONTRACTS.RATE_FREELANCER' | translate }}</h2>
    <mat-dialog-content>
      <div class="rating-section">
        <p>{{ 'CLIENT.CONTRACTS.RATE_DESC' | translate }}</p>
        <div class="stars-wrapper">
          <app-rating-stars [score]="score()" [readonly]="false" (scoreChange)="score.set($event)"></app-rating-stars>
          <span class="score-label">{{ score() }}/5</span>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CLIENT.CONTRACTS.COMMENT' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="comment" rows="3" maxlength="1000"></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary"
              [disabled]="score() === 0"
              (click)="submit()">
        {{ 'COMMON.SUBMIT' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .rating-section { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
    .stars-wrapper { display: flex; align-items: center; gap: 12px; }
    .score-label { font-size: 16px; font-weight: 600; color: var(--primary-color, #FF6B35); }
    .full-width { width: 100%; }
  `]
})
export class RatingDialogComponent {
  score = signal(0);
  comment = '';

  constructor(
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contract: Contract }
  ) {}

  submit(): void {
    if (this.score() > 0) {
      this.dialogRef.close({ score: this.score(), comment: this.comment });
    }
  }
}
