import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { Freelancer } from '../../../core/models/user.model';

@Component({
  selector: 'app-client-freelancers',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule
  ],
  templateUrl: './freelancers.html',
  styleUrl: './freelancers.scss'
})
export class ClientFreelancersComponent implements OnInit {
  private readonly userService = inject(UserService);

  readonly loading = signal(true);
  readonly freelancers = signal<Freelancer[]>([]);
  readonly filtered = signal<Freelancer[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.userService.getFreelancers().subscribe({
      next: (data) => {
        this.freelancers.set(data);
        this.filtered.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    const q = this.searchTerm.toLowerCase();
    if (!q.trim()) {
      this.filtered.set(this.freelancers());
      return;
    }
    this.filtered.set(this.freelancers().filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.skills?.some(s => s.toLowerCase().includes(q))
    ));
  }

  getInitials(name: string): string {
    return name.split(' ').filter(w => w.length > 0).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
