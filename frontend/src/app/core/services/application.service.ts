import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  apply(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/api/applications`, application);
  }

  getByFreelancer(freelancerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/api/applications/freelancer/${freelancerId}`);
  }

  getByProject(projectId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/api/applications/project/${projectId}`);
  }

  accept(id: number): Observable<Application> {
    return this.http.put<Application>(
      `${this.apiUrl}/api/applications/${id}/status`,
      null,
      { params: { status: 'ACCEPTED' } }
    );
  }

  reject(id: number): Observable<Application> {
    return this.http.put<Application>(
      `${this.apiUrl}/api/applications/${id}/status`,
      null,
      { params: { status: 'REJECTED' } }
    );
  }
}
