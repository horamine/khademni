export type { Contract, ContractStatus } from './application.model';

export interface CreateContractRequest {
  applicationId: number;
  startDate: string;
  endDate: string;
  payment: number;
}
