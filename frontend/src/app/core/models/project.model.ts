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
  // Note: backend stores clientId as String (email-based reference to user-service)
  clientId?: string;
  createdAt?: string;
}
