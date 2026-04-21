export enum ProjectStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  status?: ProjectStatus;
  clientId?: string;
  createdAt?: string;
}
