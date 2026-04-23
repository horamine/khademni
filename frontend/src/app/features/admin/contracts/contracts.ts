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
import { ToastrService } from 'ngx-toastr';
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
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(true);
  readonly contracts = signal<Contract[]>([]);
  readonly filtered = signal<Contract[]>([]);

  statusFilter = '';
  readonly statuses = ['', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'];
  displayedColumns = ['id', 'projectId', 'clientId', 'freelancerId', 'payment', 'status', 'startDate', 'endDate', 'actions'];

  readonly ContractStatus = ContractStatus;

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading.set(true);
    this.contractService.getAll().subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        this.applyFilters();
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

  cancelContract(contract: Contract): void {
    if (!confirm('Annuler ce contrat ?')) return;
    this.contractService.updateStatus(contract.id!, ContractStatus.CANCELLED).subscribe({
      next: () => {
        this.toastr.success('Contrat annulé.');
        this.loadContracts();
      },
      error: () => this.toastr.error('Erreur lors de l\'annulation.')
    });
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
