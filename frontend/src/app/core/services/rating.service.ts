import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateRatingRequest, FreelancerRatingSummary } from '../models/rating.model';

export interface RatingDto {
  id?: number;
  contractId?: number;
  clientId: number;
  freelancerId: number;
  score: number;
  comment: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  create(req: CreateRatingRequest): Observable<RatingDto> {
    return this.http.post<RatingDto>(`${this.apiUrl}/api/ratings`, req);
  }

  getForFreelancer(freelancerId: number): Observable<RatingDto[]> {
    return this.http.get<RatingDto[]>(`${this.apiUrl}/api/ratings/freelancer/${freelancerId}`);
  }

  getAverage(freelancerId: number): Observable<FreelancerRatingSummary> {
    return this.http.get<FreelancerRatingSummary>(`${this.apiUrl}/api/ratings/freelancer/${freelancerId}/average`);
  }

  // Legacy
  add(rating: Partial<{ freelancerId: number; clientId: number; score: number; comment: string }>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/ratings`, rating);
  }

  getByFreelancer(freelancerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/ratings/freelancer/${freelancerId}`);
  }
}
