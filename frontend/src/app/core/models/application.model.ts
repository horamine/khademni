export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Application {
  id?: number;
  projectId: number;
  freelancerId: number;
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
}

// TODO: confirm endpoint with backend — no /api/contracts route in gateway

export interface Rating {
  id?: number;
  freelancerId: number;
  clientId: number;
  projectId: number;
  score: number;
  comment: string;
  createdAt?: string;
}
