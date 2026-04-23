import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ContractService } from '../../../core/services/contract.service';
import { Contract, ContractStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-contracts',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './contracts.html',
  styleUrl: './contracts.scss'
})
export class AdminContractsComponent implements OnInit {
  private readonly contractService = inject(ContractService);

  readonly loading = signal(true);
  readonly contracts = signal<Contract[]>([]);
  readonly filtered = signal<Contract[]>([]);

  statusFilter = '';
  readonly statuses = ['', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
  displayedColumns = ['id', 'projectId', 'clientId', 'freelancerId', 'payment', 'status', 'startDate', 'endDate'];

  readonly ContractStatus = ContractStatus;

  ngOnInit(): void {
    this.contractService.getAll().subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        this.filtered.set(contracts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.contracts();
    if (this.statusFilter) {
      result = result.filter(c => c.status === this.statusFilter);
    }
    this.filtered.set(result);
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'ACTIVE': return '#004E89';
      case 'COMPLETED': return '#00B894';
      case 'CANCELLED': return '#E74C3C';
      case 'PENDING': return '#FDCB6E';
      case 'REJECTED': return '#636E72';
      default: return '#636E72';
    }
  }
}
