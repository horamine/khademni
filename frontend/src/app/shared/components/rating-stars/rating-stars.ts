import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="stars-row">
      @for (star of stars; track star) {
        <mat-icon
          class="star-icon"
          [class.filled]="star <= (score || 0)"
          [class.interactive]="!readonly"
          (click)="!readonly && onStarClick(star)">
          {{ star <= (score || 0) ? 'star' : 'star_border' }}
        </mat-icon>
      }
    </div>
  `,
  styles: [`
    .stars-row { display: flex; align-items: center; gap: 2px; }
    .star-icon { color: #ccc; font-size: 22px; width: 22px; height: 22px; transition: color 0.15s; }
    .star-icon.filled { color: #FDCB6E; }
    .star-icon.interactive { cursor: pointer; }
    .star-icon.interactive:hover { color: #e0a800; }
  `]
})
export class RatingStarsComponent {
  @Input() score: number | null = null;
  @Input() readonly: boolean = true;
  @Output() scoreChange = new EventEmitter<number>();

  readonly stars = [1, 2, 3, 4, 5];

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.scoreChange.emit(star);
    }
  }
}
