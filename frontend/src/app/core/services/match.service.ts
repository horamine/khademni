import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchScoreDto, RecommendedFreelancer, RecommendedProject } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getScore(freelancerId: number, projectId: number): Observable<MatchScoreDto> {
    return this.http.get<MatchScoreDto>(`${this.apiUrl}/api/match/score`, {
      params: { freelancerId: freelancerId.toString(), projectId: projectId.toString() }
    });
  }

  getRecommendedProjects(freelancerId: number, limit = 5): Observable<RecommendedProject[]> {
    return this.http.get<RecommendedProject[]>(
      `${this.apiUrl}/api/match/freelancers/${freelancerId}/recommended-projects`,
      { params: { limit: limit.toString() } }
    );
  }

  getRecommendedFreelancers(projectId: number, limit = 5): Observable<RecommendedFreelancer[]> {
    return this.http.get<RecommendedFreelancer[]>(
      `${this.apiUrl}/api/match/projects/${projectId}/recommended-freelancers`,
      { params: { limit: limit.toString() } }
    );
  }
}
