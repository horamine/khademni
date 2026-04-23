import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../../core/services/contract.service';
import { Contract, ContractStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-freelancer-contracts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './contracts.html',
  styleUrl: './contracts.scss'
})
export class FreelancerContractsComponent implements OnInit {
  private readonly contractService = inject(ContractService);
  private readonly toastr = inject(ToastrService);

  readonly loading = signal(true);
  readonly contracts = signal<Contract[]>([]);
  readonly ContractStatus = ContractStatus;

  ngOnInit(): void {
    this.contractService.getMine().subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  acceptContract(contract: Contract): void {
    if (!confirm('Accepter ce contrat ?')) return;
    this.contractService.accept(contract.id!).subscribe({
      next: (updated) => {
        this.contracts.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.toastr.success('Contrat accepté !');
      },
      error: () => this.toastr.error('Erreur lors de l\'acceptation.')
    });
  }

  rejectContract(contract: Contract): void {
    if (!confirm('Rejeter ce contrat ?')) return;
    this.contractService.reject(contract.id!).subscribe({
      next: (updated) => {
        this.contracts.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.toastr.info('Contrat rejeté.');
      },
      error: () => this.toastr.error('Erreur lors du rejet.')
    });
  }

  cancelContract(contract: Contract): void {
    if (!confirm('Annuler ce contrat ?')) return;
    this.contractService.cancel(contract.id!).subscribe({
      next: (updated) => {
        this.contracts.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.toastr.info('Contrat annulé.');
      },
      error: () => this.toastr.error('Erreur lors de l\'annulation.')
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'PENDING': return '#FDCB6E';
      case 'ACTIVE': return '#004E89';
      case 'COMPLETED': return '#00B894';
      case 'CANCELLED': return '#E74C3C';
      case 'REJECTED': return '#636E72';
      default: return '#636E72';
    }
  }
}
