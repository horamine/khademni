export interface MatchScoreDto {
  score: number;
  skillMatch: number;
  experienceFactor: number;
  availabilityFactor: number;
  freelancerId: number;
  projectId: number;
}

export interface RecommendedProject {
  projectId: number;
  title: string;
  budget: number;
  requiredSkills: string[];
  matchScore: number;
  skillMatch: number;
  experienceFactor: number;
  availabilityFactor: number;
}

export interface RecommendedFreelancer {
  freelancerId: number;
  name: string;
  skills: string[];
  experienceYears: number;
  availability: number;
  matchScore: number;
  skillMatch: number;
  experienceFactor: number;
  availabilityFactor: number;
}
