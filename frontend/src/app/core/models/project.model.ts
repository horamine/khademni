export enum ProjectStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  deadline?: string;
  status?: ProjectStatus;
  clientId?: string;
  createdAt?: string;
}
