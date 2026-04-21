import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, Freelancer, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getFreelancers(): Observable<Freelancer[]> {
    return this.http.get<Freelancer[]>(`${this.apiUrl}/api/freelancers`);
  }

  getFreelancerById(id: number): Observable<Freelancer> {
    return this.http.get<Freelancer>(`${this.apiUrl}/api/freelancers/${id}`);
  }

  updateFreelancer(id: number, freelancer: Partial<Freelancer>): Observable<Freelancer> {
    return this.http.put<Freelancer>(`${this.apiUrl}/api/freelancers/${id}`, freelancer);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/api/clients`);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/api/clients/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/users/${id}`);
  }
}
