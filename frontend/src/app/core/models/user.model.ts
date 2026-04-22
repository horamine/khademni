export enum Role {
  FREELANCER = 'FREELANCER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Freelancer extends User {
  skills: string[];
  experienceYears: number;
  availability: number;
  profileComplete: boolean;
}

export interface Client extends User {
  company: string;
  budgetRange: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  // Freelancer fields
  skills?: string[];
  experienceYears?: number;
  availability?: number;
  // Client fields
  company?: string;
  budgetRange?: string;
}

// Note: backend login returns a raw JWT string, not this object.
// Use this interface to hold decoded/stored auth state.
export interface AuthResponse {
  token: string;
  role: Role;
  email: string;
  name: string;
  id?: number;
}
