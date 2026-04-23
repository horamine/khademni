import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateService } from '@ngx-translate/core';
import { MatchScoreDto } from '../../../core/models/match.model';

@Component({
  selector: 'app-match-score-badge',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  template: `
    <div class="badge-container"
         [matTooltip]="tooltipText"
         matTooltipPosition="above">
      <svg viewBox="0 0 36 36" class="score-ring">
        <circle cx="18" cy="18" r="15.9155" fill="none"
          class="ring-bg" stroke-width="3"/>
        <circle cx="18" cy="18" r="15.9155" fill="none"
          [attr.stroke]="color" stroke-width="3"
          stroke-dasharray="100" stroke-linecap="round"
          [style.stroke-dashoffset]="dashOffset"
          transform="rotate(-90 18 18)"/>
      </svg>
      <span class="score-text" [style.color]="color">{{ score | number:'1.0-0' }}</span>
    </div>
  `,
  styles: [`
    .badge-container {
      position: relative;
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .score-ring {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
    .ring-bg { stroke: rgba(128,128,128,0.2); }
    .score-text {
      position: relative;
      font-size: 11px;
      font-weight: 700;
      z-index: 1;
    }
  `]
})
export class MatchScoreBadgeComponent {
  @Input() score: number = 0;
  @Input() breakdown: MatchScoreDto | null = null;

  private readonly translate = inject(TranslateService);

  get color(): string {
    if (this.score >= 75) return '#00B894';
    if (this.score >= 50) return '#FF6B35';
    return '#b2bec3';
  }

  get dashOffset(): number {
    return 100 - (this.score || 0);
  }

  get tooltipText(): string {
    const scoreLabel = this.translate.instant('MATCH.SCORE_LABEL');
    if (!this.breakdown) return `${scoreLabel}: ${this.score}`;
    const skillsLabel = this.translate.instant('MATCH.SKILLS');
    const expLabel = this.translate.instant('MATCH.EXPERIENCE');
    const availLabel = this.translate.instant('MATCH.AVAILABILITY');
    return `${scoreLabel}: ${this.score}\n${skillsLabel}: ${this.breakdown.skillMatch}\n${expLabel}: ${this.breakdown.experienceFactor}\n${availLabel}: ${this.breakdown.availabilityFactor}`;
  }
}
