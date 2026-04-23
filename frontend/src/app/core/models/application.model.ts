export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum ContractStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface Application {
  id?: number;
  projectId: number;
  freelancerId: number;
  coverLetter?: string;
  proposedBudget?: number;
  appliedAt?: string;
  status?: ApplicationStatus;
}

export interface Contract {
  id?: number;
  applicationId: number;
  freelancerId: number;
  clientId: number;
  projectId: number;
  startDate: string;
  endDate: string;
  status?: ContractStatus;
  payment: number;
  createdAt?: string;
  updatedAt?: string;
  projectTitle?: string;
  clientName?: string;
  freelancerName?: string;
}

export interface Rating {
  id?: number;
  contractId?: number;
  freelancerId: number;
  clientId: number;
  score: number;
  comment: string;
  createdAt?: string;
}

