import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rating } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  add(rating: Partial<Rating>): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/api/ratings`, rating);
  }

  getByFreelancer(freelancerId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/api/ratings/freelancer/${freelancerId}`);
  }

  getAverage(freelancerId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/ratings/freelancer/${freelancerId}/average`);
  }
}
