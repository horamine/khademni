export type { Rating } from './application.model';

export interface CreateRatingRequest {
  contractId: number;
  score: number;
  comment: string;
}

export interface FreelancerRatingSummary {
  freelancerId: number;
  averageScore: number;
  totalRatings: number;
}
