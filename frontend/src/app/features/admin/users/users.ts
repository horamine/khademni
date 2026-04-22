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
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly deletingId = signal<number | null>(null);
  readonly users = signal<User[]>([]);
  readonly filtered = signal<User[]>([]);

  searchTerm = '';
  roleFilter = '';
  readonly roles = ['', 'FREELANCER', 'CLIENT', 'ADMIN'];
  displayedColumns = ['id', 'name', 'email', 'role', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filtered.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.users();
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    if (this.roleFilter) {
      result = result.filter(u => u.role === this.roleFilter);
    }
    this.filtered.set(result);
  }

  deleteUser(user: User): void {
    if (!confirm(`Supprimer l'utilisateur "${user.name}" ? Cette action est irréversible.`)) return;
    this.deletingId.set(user.id);
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.update(us => us.filter(u => u.id !== user.id));
        this.applyFilters();
        this.deletingId.set(null);
        this.snackBar.open('Utilisateur supprimé.', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.deletingId.set(null);
        this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 4000 });
      }
    });
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'FREELANCER': return '#004E89';
      case 'CLIENT': return '#FF6B35';
      case 'ADMIN': return '#E74C3C';
      default: return '#636E72';
    }
  }

  // TODO: Block user functionality (requires backend support)
  blockUser(user: User): void {
    this.snackBar.open('Fonctionnalité de blocage non disponible (TODO backend).', 'Fermer', { duration: 3000 });
  }
}
