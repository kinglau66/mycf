import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { LoanType } from 'app/entities/enumerations/loan-type.model';

export interface ICreditLimit {
  id: number;
  type?: LoanType | null;
  totalLimit?: number | null;
  creditFacility?: Pick<ICreditFacility, 'id'> | null;
}

export type NewCreditLimit = Omit<ICreditLimit, 'id'> & { id: null };
