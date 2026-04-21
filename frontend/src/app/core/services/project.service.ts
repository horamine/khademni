import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';

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

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/api/projects`, project);
  }
}
