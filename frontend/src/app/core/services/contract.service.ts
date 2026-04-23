import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contract, ContractStatus } from '../models/application.model';
import { CreateContractRequest } from '../models/contract.model';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  create(req: CreateContractRequest): Observable<Contract> {
    return this.http.post<Contract>(`${this.apiUrl}/api/contracts`, req);
  }

  getMine(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/api/contracts/mine`);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/api/contracts/${id}`);
  }

  accept(id: number): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/api/contracts/${id}/accept`, {});
  }

  reject(id: number): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/api/contracts/${id}/reject`, {});
  }

  complete(id: number): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/api/contracts/${id}/complete`, {});
  }

  cancel(id: number): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/api/contracts/${id}/cancel`, {});
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

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/api/contracts`);
  }
}

