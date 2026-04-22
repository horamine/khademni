import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectStatus } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects`);
  }

  getOpen(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects/open`);
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/api/projects/${id}`);
  }

  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects/my`);
  }

  getByClient(clientEmail: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects/client/${clientEmail}`);
  }

  create(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/api/projects`, project);
  }

  update(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/api/projects/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/projects/${id}`);
  }

  updateStatus(id: number, status: ProjectStatus): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/api/projects/${id}/status`, { status });
  }
}
