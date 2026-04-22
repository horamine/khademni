import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contract, ContractStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  create(contract: Partial<Contract>): Observable<Contract> {
    return this.http.post<Contract>(`${this.apiUrl}/api/contracts`, contract);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/api/contracts/${id}`);
  }

  getByFreelancer(freelancerId: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/api/contracts/freelancer/${freelancerId}`);
  }

  getByClient(clientId: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/api/contracts/client/${clientId}`);
  }

  updateStatus(id: number, status: ContractStatus): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/api/contracts/${id}/status`, { status });
  }
}
