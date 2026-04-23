import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../../core/models/project.model';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-create-contract-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'CLIENT.CONTRACTS.CREATE_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="contract-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTRACTS.START_DATE' | translate }}</mat-label>
          <input matInput [matDatepicker]="startPicker" formControlName="startDate" />
          <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTRACTS.END_DATE' | translate }}</mat-label>
          <input matInput [matDatepicker]="endPicker" formControlName="endDate" />
          <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'CONTRACTS.PAYMENT' | translate }} (MAD)</mat-label>
          <mat-icon matPrefix>monetization_on</mat-icon>
          <input matInput type="number" formControlName="payment" min="1" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid"
              (click)="submit()">
        {{ 'CLIENT.CONTRACTS.CREATE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .contract-form { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; min-width: 320px; }
    .full-width { width: 100%; }
  `]
})
export class CreateContractDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<CreateContractDialogComponent>>(MatDialogRef);

  data: { application: Application; project: Project | null };

  form = this.fb.group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    payment: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: { application: Application; project: Project | null }) {
    this.data = data;
    this.form.patchValue({ payment: data.project?.budget ?? 0 });
  }

  submit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const toISODate = (d: Date | null) => d ? d.toISOString().split('T')[0] : '';
      this.dialogRef.close({
        startDate: toISODate(raw.startDate),
        endDate: toISODate(raw.endDate),
        payment: raw.payment
      });
    }
  }
}
