import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  apply(application: Partial<Application>): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/api/applications`, application);
  }

  getByFreelancer(freelancerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/api/applications/freelancer/${freelancerId}`);
  }

  getByProject(projectId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/api/applications/project/${projectId}`);
  }

  updateStatus(id: number, status: ApplicationStatus): Observable<Application> {
    return this.http.put<Application>(
      `${this.apiUrl}/api/applications/${id}/status`,
      { status }
    );
  }

  accept(id: number): Observable<Application> {
    return this.updateStatus(id, ApplicationStatus.ACCEPTED);
  }

  reject(id: number): Observable<Application> {
    return this.updateStatus(id, ApplicationStatus.REJECTED);
  }
}
