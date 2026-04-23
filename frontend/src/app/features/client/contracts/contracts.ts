import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../../../core/services/contract.service';
import { RatingService } from '../../../core/services/rating.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contract, ContractStatus } from '../../../core/models/application.model';
import { RatingDialogComponent } from './rating-dialog';

@Component({
  selector: 'app-client-contracts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDialogModule, MatChipsModule, TranslateModule
  ],
  templateUrl: './contracts.html',
  styleUrl: './contracts.scss'
})
export class ClientContractsComponent implements OnInit {
  private readonly contractService = inject(ContractService);
  private readonly ratingService = inject(RatingService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(true);
  readonly contracts = signal<Contract[]>([]);
  readonly ratedContractIds = signal<Set<number>>(new Set());
  readonly ContractStatus = ContractStatus;

  ngOnInit(): void {
    this.contractService.getMine().subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        this.loading.set(false);
        this.loadRatings(contracts);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadRatings(contracts: Contract[]): void {
    const userId = this.authService.userId();
    if (!userId) return;
    // Check rated contracts via each contract's id - build a set
    const completedContracts = contracts.filter(c => c.status === ContractStatus.COMPLETED);
    if (completedContracts.length === 0) return;
    // Load all ratings for freelancers in completed contracts and mark those contract ids
    const ratedIds = new Set<number>();
    let pending = completedContracts.length;
    completedContracts.forEach(c => {
      this.ratingService.getForFreelancer(c.freelancerId).subscribe({
        next: (ratings) => {
          ratings.forEach(r => {
            if (r.contractId) ratedIds.add(r.contractId);
          });
          pending--;
          if (pending === 0) this.ratedContractIds.set(ratedIds);
        },
        error: () => { pending--; }
      });
    });
  }

  markCompleted(contract: Contract): void {
    if (!confirm('Marquer ce contrat comme terminé ?')) return;
    this.contractService.complete(contract.id!).subscribe({
      next: (updated) => {
        this.contracts.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.toastr.success('Contrat terminé !');
      },
      error: () => this.toastr.error('Erreur lors de la complétion.')
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

  rateFreelancer(contract: Contract): void {
    const ref = this.dialog.open(RatingDialogComponent, {
      width: '400px',
      data: { contract }
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ratingService.create({ contractId: contract.id!, score: result.score, comment: result.comment }).subscribe({
          next: () => {
            this.ratedContractIds.update(ids => {
              const next = new Set(ids);
              next.add(contract.id!);
              return next;
            });
            this.toastr.success('Évaluation envoyée !');
          },
          error: (err) => this.toastr.error(err?.error?.message || 'Erreur lors de l\'évaluation.')
        });
      }
    });
  }

  isRated(contract: Contract): boolean {
    return this.ratedContractIds().has(contract.id!);
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
